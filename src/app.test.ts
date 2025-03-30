import { jest } from '@jest/globals';
import { runMcpClient } from './app.js';

// Mock the SDK client
jest.mock('@modelcontextprotocol/sdk/client/index.js', () => ({
  Client: jest.fn().mockImplementation(() => ({
    connect: jest.fn().mockResolvedValue(undefined),
    listTools: jest.fn().mockResolvedValue({
      tools: [
        {
          name: 'fetch',
          description: 'Fetches a URL from the internet',
          inputSchema: {
            type: 'object',
            properties: {
              url: { type: 'string' }
            }
          }
        }
      ]
    })
  }))
}));

// Mock the transport
jest.mock('@modelcontextprotocol/sdk/client/stdio.js', () => ({
  StdioClientTransport: jest.fn().mockImplementation(() => ({
    close: jest.fn()
  }))
}));

describe('MCP Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console.log to avoid cluttering test output
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('should connect to the MCP server and list tools', async () => {
    const result = await runMcpClient();
    
    expect(result).toEqual({
      tools: [
        {
          name: 'fetch',
          description: expect.any(String),
          inputSchema: expect.any(Object)
        }
      ]
    });
  });
});