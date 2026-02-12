# Publishing

This guide covers the publishing workflow using git-cliff and manual releases.

## Overview

The template uses:

- **git-cliff** for changelog generation from conventional commits
- **Manual workflow dispatch** for version bumps
- **npm provenance** for supply chain security

## Workflow

### 1. Make Changes

Develop your feature or fix using conventional commits:

```bash
git checkout -b feat/my-feature
# Make changes
git commit -m "feat: add new feature"
git push origin feat/my-feature
```

### 2. Create Pull Request

Open a PR and merge to `main` after review.

### 3. Trigger Release

1. Go to **Actions** → **Release** workflow
2. Click **Run workflow**
3. Select version bump type:
   - `patch` - Bug fixes (1.0.0 → 1.0.1)
   - `minor` - New features (1.0.0 → 1.1.0)
   - `major` - Breaking changes (1.0.0 → 2.0.0)
4. Click **Run workflow**

### 4. Automatic Steps

The workflow automatically:

1. Bumps version in `package.json`
2. Generates `CHANGELOG.md` from commits
3. Publishes to npm with provenance
4. Commits and pushes changes
5. Creates git tag (`v1.2.3`)
6. Creates GitHub release with notes

## Commit Convention

git-cliff parses [Conventional Commits](https://www.conventionalcommits.org/):

| Type       | Description             | Changelog Section |
| ---------- | ----------------------- | ----------------- |
| `feat`     | New feature             | 🚀 Features       |
| `fix`      | Bug fix                 | 🐛 Bug Fixes      |
| `docs`     | Documentation           | 📚 Documentation  |
| `perf`     | Performance improvement | ⚡ Performance    |
| `refactor` | Code refactoring        | 🚜 Refactor       |
| `test`     | Adding tests            | 🧪 Testing        |
| `chore`    | Maintenance tasks       | ⚙️ Miscellaneous  |

### Examples

```bash
# Feature
git commit -m "feat: add dark mode toggle"

# Bug fix with scope
git commit -m "fix(auth): resolve token refresh issue"

# Breaking change
git commit -m "feat!: rename parse to parseInput"
```

## CHANGELOG Format

git-cliff generates changelogs automatically:

```markdown
## [1.2.0] - 2026-01-21

### 🚀 Features

- Add dark mode toggle
- _(auth)_ Add OAuth2 support

### 🐛 Bug Fixes

- _(auth)_ Resolve token refresh issue
```

## Configuration

The `cliff.toml` controls changelog generation:

```toml
[changelog]
header = """
# Changelog
"""
body = """
{% for group, commits in commits | group_by(attribute="group") %}
    ### {{ group | upper_first }}
    {% for commit in commits %}
        - {% if commit.scope %}*({{ commit.scope }})* {% endif %}{{ commit.message }}
    {% endfor %}
{% endfor %}
"""

[git]
conventional_commits = true
commit_parsers = [
    { message = "^feat", group = "🚀 Features" },
    { message = "^fix", group = "🐛 Bug Fixes" },
    # ... more parsers
]
```

## npm Setup

### For New Packages

1. Create npm account at [npmjs.com](https://www.npmjs.com/)
2. Generate access token (Automation type)
3. Add `NPM_TOKEN` secret to GitHub repository

### Scoped Packages

For `@scope/package-name`:

1. Create or join an npm organization
2. The workflow uses `--access public` by default

## Manual Publishing

If needed, publish manually:

```bash
# Build first
bun run build

# Publish
npm publish --access public
```

## Troubleshooting

### Release Workflow Failed

- Verify `GH_PAT` has `repo` scope
- Verify `NPM_TOKEN` is valid
- Check if branch protection allows the PAT

### Changelog Not Generated

- Ensure commits follow conventional format
- Check `cliff.toml` configuration

### npm Publish Failed

- Verify `NPM_TOKEN` is set correctly
- Check npm account permissions
- Ensure package name is available
