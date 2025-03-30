# CLAUDE.md - Guidelines for thousand-tools-mcp

## Build/Test Commands
- Run: `npm run start` or `tsx src/index.ts`
- Dev mode: `npm run dev` or `tsx watch src/index.ts`
- Build: `npm run build`
- Test all: `npm test` or `jest`
- Test single: `jest src/path/to/file.test.ts`
- Test specific suite: `jest -t "test name pattern"`
- Test watch mode: `npm run test:watch`
- Test coverage: `npm run test:coverage`
- Lint: `npm run lint`

## Code Style Guidelines
- Use TypeScript with modern ES features
- Import order: built-ins, external packages, internal modules
- Prefer named exports over default exports
- Use `const` and `let`, avoid `var`
- Use strict types; avoid `any` when possible
- Error handling: prefer try/catch blocks with typed errors
- Async: use async/await over raw Promises
- Variable naming: camelCase for variables, PascalCase for types
- Comments: JSDoc style for functions and interfaces
- Keep functions small and single-purpose