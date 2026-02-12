# Documentation

This guide covers how to work with the VitePress documentation site.

## Local Development

Start the development server:

```bash
bun run docs:dev
```

The site will be available at `http://localhost:5173/npm-ts-template/`.

## Building

Build the documentation for production:

```bash
bun run docs:build
```

Preview the built site:

```bash
bun run docs:preview
```

## Project Structure

```
docs/
├── .vitepress/
│   └── config.ts       # VitePress configuration
├── public/
│   └── favicon.svg     # Site favicon
├── configuration/      # Tool configuration guides
├── guides/             # How-to guides
├── reference/          # Reference documentation
├── getting-started.md  # Getting started guide
└── index.md            # Home page
```

## Adding New Pages

### 1. Create the Markdown File

Create a new `.md` file in the appropriate directory:

```bash
# For a new guide
docs/guides/my-guide.md

# For a new configuration doc
docs/configuration/my-tool.md
```

### 2. Add Front Matter (Optional)

```markdown
---
title: My Guide
description: A helpful guide
---

# My Guide

Content here...
```

### 3. Update the Sidebar

Edit `docs/.vitepress/config.ts` to add your page to the navigation:

```typescript
sidebar: [
  {
    text: "Guides",
    items: [
      // ... existing items
      { text: "My Guide", link: "/guides/my-guide" },
    ],
  },
],
```

## VitePress Features

### Tips and Warnings

```markdown
::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::
```

### Code Blocks

````markdown
```typescript
const greeting = "Hello, World!";
```
````

With line highlighting:

````markdown
```typescript{2}
function greet(name: string) {
  return `Hello, ${name}!`; // This line is highlighted
}
```
````

### Tables

```markdown
| Column 1 | Column 2 |
| -------- | -------- |
| Value 1  | Value 2  |
```

## Configuration

The VitePress config is at `docs/.vitepress/config.ts`:

```typescript
import { defineConfig } from "vitepress";

export default defineConfig({
  title: "npm-ts-template",
  description: "A zero-config TypeScript library template with modern tooling",
  base: "/npm-ts-template/",

  head: [
    [
      "link",
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/npm-ts-template/favicon.svg",
      },
    ],
  ],

  themeConfig: {
    // Navigation, sidebar, footer, etc.
  },
});
```

### Key Settings

| Setting       | Description                              |
| ------------- | ---------------------------------------- |
| `title`       | Site title shown in browser tab          |
| `description` | Meta description for SEO                 |
| `base`        | Base URL path (must match repo name)     |
| `head`        | Additional HTML head elements            |
| `themeConfig` | Theme customization (nav, sidebar, etc.) |

## Deployment

Documentation is automatically deployed to GitHub Pages when changes are pushed to `main`.

### Workflow

The `.github/workflows/docs.yml` workflow:

1. Triggers on push to `main` when `docs/**` changes
2. Builds the VitePress site
3. Deploys to GitHub Pages

### Manual Deployment

You can also trigger a deployment manually:

1. Go to Actions → Docs
2. Click "Run workflow"

### Setup Requirements

For the workflow to work:

1. Go to repo Settings → Pages
2. Set Source to **"GitHub Actions"**

## Customization

### Adding a Logo

Place your logo in `docs/public/` and update the config:

```typescript
themeConfig: {
  logo: "/logo.svg",
}
```

### Changing Colors

Create `docs/.vitepress/theme/index.ts`:

```typescript
import DefaultTheme from "vitepress/theme";
import "./custom.css";

export default DefaultTheme;
```

And `docs/.vitepress/theme/custom.css`:

```css
:root {
  --vp-c-brand-1: #3178c6;
  --vp-c-brand-2: #2563eb;
}
```
