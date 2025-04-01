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
    console.log('AVAILABLE MCP TOOLS\n');

    // Create a test.db file in the user's home directory
    const testDbPath = path.join(os.homedir(), 'test.db');
    
    // Creating test database if needed
    try {
      execSync(`touch "${testDbPath}"`);
    } catch (error) {
      console.error(`Failed to create SQLite database file: ${error}`);
    }

    // Connect to all servers
    const fetchResult = await connectToServer('uvx', ['mcp-server-fetch']);
    const memoryResult = await connectToServer('npx', ['-y', '@modelcontextprotocol/server-memory']);
    const sqliteResult = await connectToServer('uvx', [
      'mcp-server-sqlite',
      '--db-path',
      testDbPath
    ]);
    
    try {
      // Display all tools in a succinct format
      console.log('FETCH:');
      displayTools(fetchResult.tools);
      
      console.log('\nMEMORY:');
      displayTools(memoryResult.tools);
      
      console.log('\nSQLITE:');
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
      // Start with tool name and short description
      const description = tool.description 
        ? ` # ${tool.description.split('.')[0].trim()}` // Take only first sentence
        : '';
      
      console.log(`${tool.name}( ${description}`);
      
      // Add parameters
      if (tool.inputSchema?.properties) {
        const paramEntries = Object.entries(tool.inputSchema.properties);
        if (paramEntries.length > 0) {
          paramEntries.forEach(([paramName, param]) => {
            const type = param.type || 'any';
            const shortDesc = param.description || '';
            const description = shortDesc ? ` # ${shortDesc}` : '';
            const required = tool.inputSchema.required?.includes(paramName) ? '' : '?';
            console.log(`  ${paramName}${required}: ${type}${description}`);
          });
        }
      }
      
      console.log(')');
    }
  } else {
    console.log('No tools found.');
  }
}