# thousand-tools-mcp

A TypeScript project with Jest testing.

## Setup

```bash
# Install dependencies
npm install
```

## Development

```bash
# Run the application
npm run start
# or directly
tsx src/index.ts

# Run in watch mode
npm run dev
```

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run a specific test file
jest src/utils.test.ts

# Run tests matching a pattern
jest -t "adds two numbers"
```

## Build

```bash
# Build the project
npm run build
```

## Project Structure

- `src/` - Source code
  - `index.ts` - Entry point
  - `utils.ts` - Utility functions
  - `*.test.ts` - Test files
- `dist/` - Compiled output