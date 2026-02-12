# Lefthook Configuration

[Lefthook](https://github.com/evilmartians/lefthook) manages git hooks for automated quality checks.

## Configuration File

The `lefthook.yml` defines hooks:

```yaml
pre-commit:
  parallel: true
  commands:
    lint:
      glob: "*.{ts,tsx,js,jsx,json}"
      run: bun run lint
    typecheck:
      glob: "*.{ts,tsx}"
      run: bun run typecheck

commit-msg:
  commands:
    commitlint:
      run: bunx commitlint --edit {1}
```

## Hooks

### Pre-commit

Runs before each commit:

| Check     | Command             | Glob Pattern             | Purpose      |
| --------- | ------------------- | ------------------------ | ------------ |
| lint      | `bun run lint`      | `*.{ts,tsx,js,jsx,json}` | Code quality |
| typecheck | `bun run typecheck` | `*.{ts,tsx}`             | Type safety  |

Both checks run in parallel for speed. Hooks only trigger when matching files are staged.

### Commit-msg

Validates commit message format:

- Uses [Conventional Commits](https://www.conventionalcommits.org/)
- Configured in `commitlint.config.ts`

Valid formats:

```
feat: add new feature
fix: resolve bug
docs: update readme
chore: update dependencies
```

## Installation

Lefthook installs automatically via the `prepare` script:

```json
{
  "scripts": {
    "prepare": "lefthook install"
  }
}
```

After `bun install`, hooks are ready.

## Bypassing Hooks

In emergencies (not recommended):

```bash
git commit --no-verify -m "emergency fix"
```

## Customization

### Adding Tests to Pre-commit

```yaml
pre-commit:
  parallel: true
  commands:
    lint:
      glob: "*.{ts,tsx,js,jsx,json}"
      run: bun run lint
    typecheck:
      glob: "*.{ts,tsx}"
      run: bun run typecheck
    test:
      glob: "*.{ts,tsx}"
      run: bun run test
```

### Adding Pre-push Hook

```yaml
pre-push:
  commands:
    test:
      run: vitest run
```

## Commitlint Custom Rules

The template includes a custom rule to prevent bare @mentions:

```typescript
// commitlint.config.ts
plugins: [
  {
    rules: {
      "no-at-mentions": ({ body, subject }) => {
        // Blocks @username but allows `@param`
      },
    },
  },
];
```
