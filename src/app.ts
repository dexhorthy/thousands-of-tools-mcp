import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import * as path from 'path';
import * as os from 'os';
import { execSync } from 'child_process';

async function connectToServer(command: string, args: string[]) {
  // Create a transport that connects to the specified server via stdio
  const transport = new StdioClientTransport({
    command,
    args
  });

  // Create an MCP client with capabilities for tools
  const client = new Client(
    {
      name: 'thousand-tools-mcp-client',
      version: '0.1.0'
    },
    {
      capabilities: {
        tools: {}
      }
    }
  );

  try {
    // Connect to the server
    await client.connect(transport);
    
    // List available tools
    const response = await client.listTools();
    
    // Return the tools and transport for cleanup
    return { 
      tools: response.tools || response,
      transport
    };
  } catch (error) {
    transport.close();
    console.error(`Error connecting to MCP server (${command} ${args.join(' ')}):`, error);
    throw error;
  }
}

export async function runMcpClient() {
  try {
    console.log('# Available MCP Tools\n');

    // Create a test.db file in the user's home directory
    const testDbPath = path.join(os.homedir(), 'test.db');
    console.log(`Using SQLite database at: ${testDbPath}`);
    try {
      // Touch the db file to make sure it exists
      execSync(`touch "${testDbPath}"`);
    } catch (error) {
      console.error(`Failed to create SQLite database file: ${error}`);
    }

    // Connect to fetch server
    const fetchResult = await connectToServer('uvx', ['mcp-server-fetch']);
    
    // Connect to memory server
    const memoryResult = await connectToServer('npx', ['-y', '@modelcontextprotocol/server-memory']);
    
    // Connect to sqlite server using uvx
    const sqliteResult = await connectToServer('uvx', [
      'mcp-server-sqlite',
      '--db-path',
      testDbPath
    ]);
    
    try {
      // Display fetch tools
      console.log('## Fetch Server Tools\n');
      displayTools(fetchResult.tools);
      
      console.log('\n## Memory Server Tools\n');
      displayTools(memoryResult.tools);
      
      console.log('\n## SQLite Server Tools\n');
      displayTools(sqliteResult.tools);
      
      return {
        fetchTools: fetchResult.tools,
        memoryTools: memoryResult.tools,
        sqliteTools: sqliteResult.tools
      };
    } finally {
      // Ensure connections are closed
      fetchResult.transport.close();
      memoryResult.transport.close();
      sqliteResult.transport.close();
    }
  } catch (error) {
    console.error('Failed to connect to one or more MCP servers:', error);
    throw error;
  }
}

function displayTools(tools: any[]) {
  if (Array.isArray(tools)) {
    for (const tool of tools) {
      console.log(`### ${tool.name}`);
      console.log(tool.description || '');
      
      if (tool.inputSchema?.properties) {
        console.log('\n#### Parameters:');
        
        for (const [paramName, param] of Object.entries(tool.inputSchema.properties)) {
          const required = tool.inputSchema.required?.includes(paramName) ? '[Required]' : '[Optional]';
          console.log(`- \`${paramName}\`: ${param.description} ${required}`);
        }
      }
      console.log('');
    }
  } else {
    console.log('No tools found or unexpected format returned.');
    console.log('Raw response:', JSON.stringify(tools, null, 2));
  }
}