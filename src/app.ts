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
    const tools = await client.listTools();
    console.log('Available MCP tools:');
    console.log(JSON.stringify(tools, null, 2));
    
    return tools;
  } catch (error) {
    console.error('Error connecting to MCP server:', error);
    throw error;
  } finally {
    // Close the connection
    transport.close();
  }
}