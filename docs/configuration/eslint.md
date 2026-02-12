# ESLint Configuration

ESLint is configured for JSDoc documentation and code quality with SonarJS.

## Configuration File

The `eslint.config.ts` uses the flat config format:

```typescript
import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import jsdoc from "eslint-plugin-jsdoc";
import sonarjs from "eslint-plugin-sonarjs";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  // Ignore generated files
  {
    ignores: ["docs/.vitepress/cache/**", "docs/.vitepress/dist/**"],
  },

  // Base JavaScript rules
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
  },

  // TypeScript rules
  tseslint.configs.recommended,

  // SonarJS for code quality
  sonarjs.configs.recommended,

  // Custom SonarJS rules
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    rules: {
      "sonarjs/cognitive-complexity": ["error", 15],
      "sonarjs/cyclomatic-complexity": ["error", { threshold: 10 }],
      // ... more rules
    },
  },

  // JSDoc for source files only
  {
    files: ["src/**/*.ts"],
    plugins: { jsdoc },
    extends: ["jsdoc/flat/recommended-typescript-error"],
    rules: {
      "jsdoc/require-jsdoc": ["error", { publicOnly: true }],
      "jsdoc/require-description": "error",
      "jsdoc/no-types": "error",
      // ... more rules
    },
  },
]);
```

## JSDoc Requirements

For files in `src/`, JSDoc is required on:

- Function declarations
- Method definitions
- Class declarations

### Required Tags

```typescript
/**
 * Description of what the function does.
 *
 * @param name - Description of the parameter
 * @returns Description of the return value
 */
export function greet(name: string): string {
  return `Hello, ${name}!`;
}
```

### No Type Annotations

Since TypeScript handles types, don't include them in JSDoc:

```typescript
// ❌ Wrong - don't include types
/**
 * @param {string} name
 * @returns {string}
 */

// ✅ Correct - types come from TypeScript
/**
 * @param name - The name to greet
 * @returns A greeting message
 */
```

## SonarJS Rules

### Complexity Limits

| Rule                  | Limit |
| --------------------- | ----- |
| Cognitive complexity  | 15    |
| Cyclomatic complexity | 10    |
| Nesting level         | 4     |
| Expression complexity | 3     |
| Lines per function    | 200   |

### Code Quality

- No duplicate strings (threshold: 3)
- No identical functions
- No collapsible if statements
- Prefer single boolean return
- Prefer immediate return

## Commands

```bash
# Run ESLint
bun run lint

# Fix auto-fixable issues
bun run lint:fix
```

## Customization

### Relaxing JSDoc Rules

For internal utilities:

```typescript
{
  files: ["src/internal/**/*.ts"],
  rules: {
    "jsdoc/require-jsdoc": "off"
  }
}
```

### Adjusting Complexity

```typescript
{
  rules: {
    "sonarjs/cognitive-complexity": ["error", 20]
  }
}
```
