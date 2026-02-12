# TypeScript Configuration

The template uses TypeScript 5.x with strict mode, extending the official [`@tsconfig/strictest`](https://github.com/tsconfig/bases) preset for library-grade type safety.

## Configuration File

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "@tsconfig/strictest",
  "compilerOptions": {
    // Target environment
    "target": "ES2022",
    "lib": ["ES2022"],
    // "lib": ["ES2022", "DOM", "DOM.Iterable"],  // Uncomment for Browser
    // "jsx": "react-jsx",                         // Uncomment for React

    // Module system (works with tsdown bundler)
    "module": "ESNext",
    "moduleResolution": "bundler",

    // Emit (tsdown handles actual output)
    "noEmit": true,
    "declaration": true,
    "declarationMap": true,

    // Additional
    "resolveJsonModule": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

## Inherited from @tsconfig/strictest

The base preset provides these strict settings automatically:

- `strict` - All strict type-checking options
- `noUnusedLocals` / `noUnusedParameters` - Catch unused code
- `noFallthroughCasesInSwitch` - Prevent switch fallthrough bugs
- `noUncheckedIndexedAccess` - Add undefined to indexed access results
- `isolatedModules` - Ensure files can be transpiled independently
- `verbatimModuleSyntax` - Enforce explicit type imports
- `esModuleInterop` / `skipLibCheck` - Compatibility settings

## Target Switching

The default configuration targets **Node.js 20+**. To target other environments, modify the `lib` and add relevant options.

### For Browser Libraries

Add DOM types to the `lib` array:

```json
{
  "compilerOptions": {
    "lib": ["ES2022", "DOM", "DOM.Iterable"]
  }
}
```

### For React Libraries

Add JSX support and DOM types:

```json
{
  "compilerOptions": {
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx"
  }
}
```

::: tip
You may also want to add `@types/react` as a dev dependency and update ESLint globals to include `browser` alongside `node`.
:::

## Customization

### Adding Path Aliases

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

::: warning
If you add path aliases, update `tsdown.config.ts` to handle them during build.
:::

### Relaxing Strict Mode (Not Recommended)

If migrating existing code:

```json
{
  "compilerOptions": {
    "strict": false,
    "noImplicitAny": false
  }
}
```

## Type Checking

Run type checking without emitting files:

```bash
bun run typecheck
```

This is also run automatically on pre-commit via Lefthook.
