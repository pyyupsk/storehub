# Writing Code

This guide covers best practices for writing library code with this template.

## Project Structure

```
src/
├── index.ts          # Main entry point (exports public API)
├── utils/            # Internal utilities
└── types.ts          # Type definitions
```

## Exporting Your API

All public exports should go through `src/index.ts`:

```typescript
// src/index.ts
export { greet } from "./greet";
export { formatDate } from "./date";
export type { GreetOptions, DateFormat } from "./types";
```

## JSDoc Requirements

Public functions require JSDoc comments:

````typescript
/**
 * Greets a person by name.
 *
 * @param name - The name of the person to greet
 * @returns A greeting message
 *
 * @example
 * ```typescript
 * greet("Alice"); // "Hello, Alice!"
 * ```
 */
export function greet(name: string): string {
  return `Hello, ${name}!`;
}
````

### Required Elements

1. **Description** - What the function does
2. **@param** - Each parameter with description
3. **@returns** - What the function returns

### Optional Elements

- **@example** - Usage examples
- **@throws** - Errors that may be thrown
- **@see** - Related functions or documentation

## Code Quality

### Complexity Limits

Keep functions simple:

| Metric                | Limit | Why                        |
| --------------------- | ----- | -------------------------- |
| Cognitive complexity  | 15    | Easy to understand         |
| Cyclomatic complexity | 10    | Easy to test               |
| Nesting depth         | 4     | Flat is better than nested |
| Lines per function    | 200   | Single responsibility      |

### Avoid Duplication

```typescript
// ❌ Bad - duplicate string
console.log("Processing started");
console.log("Processing started");
console.log("Processing started");

// ✅ Good - use a constant
const LOG_PREFIX = "Processing started";
console.log(LOG_PREFIX);
```

## Error Handling

Use typed errors:

```typescript
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

/**
 * Validates user input.
 *
 * @param input - The input to validate
 * @throws ValidationError if input is invalid
 */
export function validate(input: string): void {
  if (!input) {
    throw new ValidationError("Input is required");
  }
}
```

## Type Safety

### Use Strict Types

```typescript
// ❌ Avoid
function process(data: any): any {
  return data.value;
}

// ✅ Better
interface Data {
  value: string;
}

function process(data: Data): string {
  return data.value;
}
```

### Export Types

```typescript
// src/types.ts
export interface Options {
  timeout?: number;
  retries?: number;
}

// src/index.ts
export type { Options } from "./types";
```

## Development Workflow

1. Write the implementation
2. Add JSDoc comments
3. Write tests
4. Run checks:

```bash
bun run typecheck  # Type safety
bun run lint       # Code quality
bun run test       # Functionality
```

## Watch Mode

For rapid development:

```bash
# Terminal 1: Build on change
bun run dev

# Terminal 2: Test on change
bun run test:watch
```
