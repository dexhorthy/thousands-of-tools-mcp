import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import * as path from 'path';
import * as os from 'os';
import { execSync } from 'child_process';
import serverConfigs from './servers.json' assert { type: 'json' };
import { ServerConfig, ServerConfigs, ServerResult, ServerResults } from './types.js';

async function connectToServer(config: ServerConfig) {
  // Create a transport that connects to the specified server via stdio
  const transport = new StdioClientTransport({
    command: config.command,
    args: config.args,
    env: config.env
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
    console.error(`Error connecting to MCP server (${config.command} ${config.args.join(' ')}):`, error);
    throw error;
  }
}

export async function runMcpClient(outputFormat: 'text' | 'json' | 'count' = 'text') {
  try {
    if (outputFormat === 'text') {
      console.log('AVAILABLE MCP TOOLS\n');
    }

    // Create a test.db file in the user's home directory
    const testDbPath = path.join(os.homedir(), 'test.db');
    
    // Creating test database if needed
    try {
      execSync(`touch "${testDbPath}"`);
    } catch (error) {
      console.error(`Failed to create SQLite database file: ${error}`);
    }

    // Update SQLite config with expanded home path
    const configs = {...serverConfigs} as ServerConfigs;
    if (configs.sqlite) {
      configs.sqlite.args = configs.sqlite.args.map(arg => 
        arg === '~/test.db' ? testDbPath : arg
      );
    }

    // Connect to all servers
    const results: ServerResults = {};
    let totalTools = 0;
    for (const [name, config] of Object.entries(configs)) {
      try {
        results[name] = await connectToServer(config);
        totalTools += results[name].tools.length;
        
        // Display tools for this server
        if (outputFormat === 'text') {
          console.log(`\n${name.toUpperCase()}:`);
          displayTools(results[name].tools);
        }
      } catch (error) {
        console.error(`Failed to connect to ${name} server:`, error);
      }
    }

    try {
      if (outputFormat === 'json') {
        const jsonOutput = Object.entries(results).reduce((acc, [serverName, result]) => {
          result.tools.forEach(tool => {
            const scopedName = `${serverName}__${tool.name}`;
            acc[scopedName] = {
              ...tool,
              name: scopedName
            };
          });
          return acc;
        }, {} as Record<string, any>);
        console.log(JSON.stringify(jsonOutput, null, 2));
      } else if (outputFormat === 'count') {
        const serverCounts = Object.entries(results).map(([name, result]) => 
          `${name}: ${result.tools.length} tools`
        );
        console.log('\nTool count by server:');
        console.log(serverCounts.join('\n'));
        console.log(`\nTotal tools available: ${totalTools}`);
      }
      return results;
    } finally {
      // Ensure all connections are closed
      Object.values(results).forEach(result => result.transport.close());
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
      
      // Check if the tool has parameters
      const hasParams = tool.inputSchema?.properties && Object.keys(tool.inputSchema.properties).length > 0;
      
      if (!hasParams) {
        // For tools without parameters, show on a single line
        console.log(`${tool.name}()${description}`);
        continue;
      }
      
      // For tools with parameters, show on multiple lines
      console.log(`${tool.name}( ${description}`);
      
      // Add parameters
      const paramEntries = Object.entries(tool.inputSchema.properties);
      paramEntries.forEach(([paramName, param]) => {
        const type = param.type || 'any';
        const shortDesc = param.description || '';
        const description = shortDesc ? ` # ${shortDesc}` : '';
        const required = tool.inputSchema.required?.includes(paramName) ? '' : '?';
        console.log(`  ${paramName}${required}: ${type}${description}`);
      });
      
      console.log(')');
    }
  } else {
    console.log('No tools found.');
  }
}