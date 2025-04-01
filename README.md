# thousand-tools-mcp

A TypeScript project that provides a unified interface to multiple Model Context Protocol (MCP) servers.

## Features

- Configurable server connections via JSON configuration
- Support for multiple MCP servers:
  - Fetch: Web content fetching and conversion
  - Memory: Knowledge graph-based persistent memory
  - SQLite: Database interaction and business intelligence
  - Filesystem: Secure file operations with access controls
  - Git: Repository management and version control
- Multiple output formats (text and JSON)

## Setup

```bash
# Install dependencies
npm install
```

## Configuration

Server configurations are defined in `src/servers.json`. Each server entry specifies:
- `command`: The command to run the server (e.g., `uvx`, `npx`)
- `args`: Command line arguments
- `env` (optional): Environment variables

Example configuration:
```json
{
  "fetch": {
    "command": "uvx",
    "args": ["mcp-server-fetch"]
  },
  "memory": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-memory"]
  }
}
```

## Development

```bash
# Run the application (text output)
npm run start

# Run the application (JSON output)
npm run start-json

# Run in watch mode
npm run dev

# Run tests
npm test
```

## Project Structure

- `src/` - Source code
  - `app.ts` - Main application logic
  - `index.ts` - Entry point
  - `servers.json` - Server configurations
  - `types.ts` - TypeScript type definitions
  - `*.test.ts` - Test files
- `dist/` - Compiled output

## Adding New Servers

To add a new MCP server:

1. Add its configuration to `src/servers.json`
2. The server will be automatically loaded and its tools displayed

## License

MIT
