# thousand-tools-mcp

A TypeScript project for pulling lists of tools off of MCP servers

## Features


- Define servers in src/servers.json
- dump tools in plaintext with `npm run start
- dump tools in JSON with `npm run start-json`

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
