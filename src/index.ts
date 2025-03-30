import { runMcpClient } from './app.js';

async function main() {
  try {
    await runMcpClient();
  } catch (error) {
    console.error('MCP client failed:', error);
    process.exit(1);
  }
}

main();