# Getting Started

## Prerequisites

- [Bun](https://bun.sh/) 1.x or later
- [Node.js](https://nodejs.org/) 20+ (for compatibility)
- A GitHub account (for publishing)

## Create Your Project

### Option 1: Use GitHub Template (Recommended)

1. Go to [npm-ts-template](https://github.com/pyyupsk/npm-ts-template)
2. Click **"Use this template"** → **"Create a new repository"**
3. Clone your new repository:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

### Option 2: Clone Directly

```bash
git clone https://github.com/pyyupsk/npm-ts-template.git my-library
cd my-library
rm -rf .git
git init
```

## Setup

Install dependencies:

```bash
bun install
```

This will also set up git hooks via Lefthook.

## Customize Your Package

### 1. Update `package.json`

```json
{
  "name": "your-package-name",
  "description": "Your package description",
  "author": "Your Name",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/YOUR_USERNAME/YOUR_REPO.git"
  }
}
```

### 2. Update Documentation

- `README.md` - Update for your package
- `LICENSE` - Update copyright holder

### 3. Start Coding

Replace the sample code in `src/index.ts`:

```typescript
/**
 * Your first function.
 *
 * @param input - Description of the input
 * @returns Description of what it returns
 */
export function myFunction(input: string): string {
  return `Result: ${input}`;
}
```

### 4. Update Tests

Update `tests/index.test.ts` to match your code:

```typescript
import { describe, expect, it } from "vitest";
import { myFunction } from "../src";

describe("myFunction", () => {
  it("should return formatted result", () => {
    expect(myFunction("test")).toBe("Result: test");
  });
});
```

## Verify Setup

Run the validation commands:

```bash
# Build the package
bun run build

# Run tests
bun run test

# Check linting
bun run lint

# Check types
bun run typecheck
```

All commands should pass without errors.

## Next Steps

- [Writing Code](/guides/writing-code) - Learn about JSDoc requirements
- [Testing](/guides/testing) - Write effective tests
- [Publishing](/guides/publishing) - Release your first version
