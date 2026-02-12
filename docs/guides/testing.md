# Testing

This guide covers testing practices with Vitest.

## Test Structure

Tests live in the `tests/` directory, mirroring `src/`:

```
src/
├── index.ts
├── utils/
│   └── format.ts
tests/
├── index.test.ts
├── utils/
│   └── format.test.ts
```

## Writing Tests

### Basic Test

```typescript
import { describe, expect, it } from "vitest";
import { greet } from "../src";

describe("greet", () => {
  it("should return greeting with name", () => {
    expect(greet("World")).toBe("Hello, World!");
  });
});
```

### Testing Edge Cases

```typescript
describe("greet", () => {
  it("should handle normal input", () => {
    expect(greet("Alice")).toBe("Hello, Alice!");
  });

  it("should handle empty string", () => {
    expect(greet("")).toBe("Hello, !");
  });

  it("should handle special characters", () => {
    expect(greet("O'Brien")).toBe("Hello, O'Brien!");
  });

  it("should handle unicode", () => {
    expect(greet("世界")).toBe("Hello, 世界!");
  });
});
```

### Testing Errors

```typescript
import { describe, expect, it } from "vitest";
import { validate, ValidationError } from "../src";

describe("validate", () => {
  it("should throw on empty input", () => {
    expect(() => validate("")).toThrow(ValidationError);
  });

  it("should throw with correct message", () => {
    expect(() => validate("")).toThrow("Input is required");
  });

  it("should not throw on valid input", () => {
    expect(() => validate("valid")).not.toThrow();
  });
});
```

### Testing Async Code

```typescript
import { describe, expect, it } from "vitest";
import { fetchData } from "../src";

describe("fetchData", () => {
  it("should resolve with data", async () => {
    const result = await fetchData("https://api.example.com");
    expect(result).toHaveProperty("data");
  });

  it("should reject on error", async () => {
    await expect(fetchData("invalid")).rejects.toThrow();
  });
});
```

## Test Organization

### Group Related Tests

```typescript
describe("Calculator", () => {
  describe("add", () => {
    it("should add positive numbers", () => {});
    it("should add negative numbers", () => {});
    it("should handle zero", () => {});
  });

  describe("divide", () => {
    it("should divide numbers", () => {});
    it("should throw on division by zero", () => {});
  });
});
```

### Setup and Teardown

```typescript
import { beforeEach, afterEach, describe, it } from "vitest";

describe("Database", () => {
  let db: Database;

  beforeEach(() => {
    db = new Database();
    db.connect();
  });

  afterEach(() => {
    db.disconnect();
  });

  it("should query data", () => {
    const result = db.query("SELECT * FROM users");
    expect(result).toBeDefined();
  });
});
```

## Mocking

### Mock Functions

```typescript
import { vi, describe, it, expect } from "vitest";

describe("notifyUser", () => {
  it("should call the callback", () => {
    const callback = vi.fn();
    notifyUser("message", callback);
    expect(callback).toHaveBeenCalledWith("message");
  });
});
```

### Mock Modules

```typescript
import { vi, describe, it, expect } from "vitest";

vi.mock("../src/api", () => ({
  fetchUser: vi.fn(() => Promise.resolve({ name: "Test" })),
}));

import { fetchUser } from "../src/api";
import { getUsername } from "../src/user";

describe("getUsername", () => {
  it("should return user name", async () => {
    const name = await getUsername(1);
    expect(name).toBe("Test");
  });
});
```

## Coverage

Run tests with coverage:

```bash
bun run test:coverage
```

### Coverage Report

The report shows:

- **Statements** - Executed statements
- **Branches** - Executed branches (if/else)
- **Functions** - Called functions
- **Lines** - Executed lines

### Aiming for Coverage

- Aim for 80%+ coverage
- Focus on critical paths
- Don't obsess over 100% - test meaningful behavior

## Running Tests

```bash
# Run all tests once
bun run test

# Watch mode (re-run on changes)
bun run test:watch

# Run specific test file
bun run test tests/index.test.ts

# Run tests matching pattern
bun run test --grep "greet"
```

## CI Integration

Tests run automatically in CI via GitHub Actions. Failed tests block merging.
