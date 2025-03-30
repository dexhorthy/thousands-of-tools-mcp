import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

export async function runMcpClient() {
  // Create a transport that connects to the fetch server via stdio
  const transport = new StdioClientTransport({
    command: 'uvx',
    args: ['mcp-server-fetch']
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
    console.log('# Available MCP Tools\n');
    
    // Check if response has a tools property (based on the example)
    const tools = response.tools || response;
    
    if (Array.isArray(tools)) {
      for (const tool of tools) {
        console.log(`## ${tool.name}`);
        console.log(tool.description || '');
        
        if (tool.inputSchema?.properties) {
          console.log('\n### Parameters:');
          
          for (const [paramName, param] of Object.entries(tool.inputSchema.properties)) {
            const required = tool.inputSchema.required?.includes(paramName) ? '[Required]' : '[Optional]';
            console.log(`- \`${paramName}\`: ${param.description} ${required}`);
          }
        }
        console.log('');
      }
    } else {
      console.log('No tools found or unexpected format returned.');
      console.log('Raw response:', JSON.stringify(response, null, 2));
    }
    
    return response;
  } catch (error) {
    console.error('Error connecting to MCP server:', error);
    throw error;
  } finally {
    // Close the connection
    transport.close();
  }
}