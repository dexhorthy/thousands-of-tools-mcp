import { runMcpClient } from './app.js';

async function main() {
  try {
    await runMcpClient();
    process.exit(0); // Explicitly exit after successful execution
  } catch (error) {
    console.error('MCP client failed:', error);
    process.exit(1);
  }
}

main();