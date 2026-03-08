# Scripts Reference

Available npm scripts for developing and maintaining `@pyyupsk/storehub`.

## Build Scripts

| Script  | Command          | Description                    |
| ------- | ---------------- | ------------------------------ |
| `build` | `tsdown`         | Build ESM/CJS bundles to dist/ |
| `dev`   | `tsdown --watch` | Build in watch mode            |

## Test Scripts

| Script          | Command                 | Description             |
| --------------- | ----------------------- | ----------------------- |
| `test`          | `vitest run`            | Run tests once          |
| `test:watch`    | `vitest`                | Run tests in watch mode |
| `test:coverage` | `vitest run --coverage` | Run tests with coverage |

## Lint Scripts

| Script         | Command                | Description             |
| -------------- | ---------------------- | ----------------------- |
| `lint`         | `eslint --cache`       | Check code quality      |
| `lint:fix`     | `eslint --fix --cache` | Fix auto-fixable issues |
| `lint:docs`    | `eslint --cache`       | Check documentation     |
| `format`       | `prettier --write .`   | Format code             |
| `format:check` | `prettier --check .`   | Check formatting (CI)   |
| `typecheck`    | `tsc --noEmit`         | Check TypeScript types  |

## Quality Scripts

| Script | Command | Description           |
| ------ | ------- | --------------------- |
| `knip` | `knip`  | Find unused code/deps |

## Documentation Scripts

| Script         | Command                  | Description               |
| -------------- | ------------------------ | ------------------------- |
| `docs:dev`     | `vitepress dev docs`     | Start docs dev server     |
| `docs:build`   | `vitepress build docs`   | Build docs for production |
| `docs:preview` | `vitepress preview docs` | Preview built docs        |

## Common Workflows

### Development

```bash
# Start development (watch mode)
bun run dev
```

### Before Committing

```bash
# Run all checks
bun run lint
bun run typecheck
bun run test
```

### Before Releasing

```bash
# Full validation
bun run build
bun run lint
bun run typecheck
bun run test:coverage
bun run knip
```

### Documentation

```bash
# Local development
bun run docs:dev

# Build and preview
bun run docs:build
bun run docs:preview
```
