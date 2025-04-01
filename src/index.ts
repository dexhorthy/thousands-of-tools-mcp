import { runMcpClient } from './app.js';

async function main() {
  try {
    const outputFormat = process.argv.includes('--json') ? 'json' : 'text';
    await runMcpClient(outputFormat);
    process.exit(0); // Explicitly exit after successful execution
  } catch (error) {
    console.error('MCP client failed:', error);
    process.exit(1);
  }
}

main();