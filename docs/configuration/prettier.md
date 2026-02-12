# Prettier Configuration

[Prettier](https://prettier.io/) handles code formatting with a consistent, opinionated style.

## Configuration File

The `.prettierrc` configures formatting options:

```json
{
  "$schema": "https://json.schemastore.org/prettierrc",
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "useTabs": false,
  "trailingComma": "es5",
  "printWidth": 80
}
```

## Ignore File

The `.prettierignore` excludes files from formatting:

```txt
dist/
node_modules/
coverage/
.vitepress/cache/
.vitepress/dist/
bun.lock
*.md
```

## Features

### Formatting

Consistent code formatting with:

- 2-space indentation
- Double quotes for strings
- Semicolons required
- Trailing commas (ES5 style)
- 80 character line width

### Import Organization

Import sorting is handled by ESLint via `eslint-plugin-simple-import-sort`. See [ESLint Configuration](/configuration/eslint) for details.

## Commands

```bash
# Format code
bun run format

# Check formatting (CI)
bun run format:check
```

## Customization

### Changing Quote Style

```json
{
  "singleQuote": true
}
```

### Changing Line Width

```json
{
  "printWidth": 100
}
```

### Using Tabs

```json
{
  "useTabs": true
}
```

## Integration

Prettier runs:

- On `bun run format` manually
- On `bun run lint:fix` (after ESLint)
- In your editor with the Prettier extension

### Editor Setup

#### VS Code

Install the [Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and add to settings:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true
}
```

#### Other Editors

See [Prettier Editor Integration](https://prettier.io/docs/en/editors.html).
