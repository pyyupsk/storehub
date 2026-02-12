# Vitest Configuration

[Vitest](https://vitest.dev/) is configured for fast, modern testing with coverage.

## Configuration File

The `vitest.config.ts` sets up the test environment:

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});
```

## Running Tests

```bash
# Run tests once
bun run test

# Run in watch mode
bun run test:watch

# Run with coverage
bun run test:coverage
```

## Writing Tests

Tests live in the `tests/` directory:

```typescript
// tests/index.test.ts
import { describe, expect, it } from "vitest";
import { greet } from "../src";

describe("greet", () => {
  it("should return greeting with name", () => {
    expect(greet("World")).toBe("Hello, World!");
  });

  it("should handle empty string", () => {
    expect(greet("")).toBe("Hello, !");
  });
});
```

## Test Patterns

### Naming Convention

- Test files: `*.test.ts` or `*.spec.ts`
- Location: `tests/` directory (mirrors `src/` structure)

### Describe Blocks

Group related tests:

```typescript
describe("MyClass", () => {
  describe("methodA", () => {
    it("should do X", () => {});
    it("should handle edge case Y", () => {});
  });

  describe("methodB", () => {
    it("should do Z", () => {});
  });
});
```

## Coverage

Coverage reports are generated in `coverage/`:

- `text` - Terminal output
- `json` - Machine-readable JSON format
- `html` - Interactive HTML report

### Coverage Thresholds

The template enforces 80% coverage thresholds by default. Tests will fail if coverage drops below these levels.

## Customization

### Adding Test Utilities

```typescript
export default defineConfig({
  test: {
    setupFiles: ["./tests/setup.ts"],
  },
});
```

### Changing Test Location

```typescript
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
  },
});
```

### Mocking

Vitest supports mocking out of the box:

```typescript
import { vi, describe, it, expect } from "vitest";

vi.mock("./dependency", () => ({
  fetchData: vi.fn(() => Promise.resolve({ data: "mocked" })),
}));
```
