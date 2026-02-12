# CI/CD

This guide covers the GitHub Actions workflows included in the template.

## Workflows

### CI Workflow

**File:** `.github/workflows/ci.yml`

Runs on every push and pull request:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - run: bun run build
      - run: bun run lint
      - run: bun run typecheck
      - run: bun run test:coverage
```

#### Checks Performed

| Check     | Command                 | Purpose              |
| --------- | ----------------------- | -------------------- |
| Build     | `bun run build`         | Package builds       |
| Lint      | `bun run lint`          | Code quality         |
| Typecheck | `bun run typecheck`     | Type safety          |
| Test      | `bun run test:coverage` | Tests pass, coverage |

### Release Workflow

**File:** `.github/workflows/release.yml`

Handles versioning and publishing via manual workflow dispatch:

```yaml
name: Release

on:
  workflow_dispatch:
    inputs:
      version:
        description: "Version bump type"
        required: true
        type: choice
        options:
          - patch
          - minor
          - major

jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      id-token: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          token: ${{ secrets.GH_PAT }}

      - uses: oven-sh/setup-bun@v2

      - uses: actions/setup-node@v4
        with:
          registry-url: "https://registry.npmjs.org"

      - name: Configure Git
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"

      - run: bun install
      - run: bun run build

      - name: Bump version
        id: version
        run: |
          npm version "${{ inputs.version }}" --no-git-tag-version
          echo "new_version=$(node -p "require('./package.json').version")" >> $GITHUB_OUTPUT

      - name: Generate CHANGELOG
        run: bunx git-cliff --tag "v${{ steps.version.outputs.new_version }}" -o CHANGELOG.md

      - name: Publish to npm
        run: npm publish --provenance --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

      - name: Commit, tag, and push
        run: |
          git add package.json CHANGELOG.md
          git commit -m "chore(release): v${{ steps.version.outputs.new_version }}"
          git push origin main
          git tag "v${{ steps.version.outputs.new_version }}"
          git push origin "v${{ steps.version.outputs.new_version }}"

      - name: Create GitHub Release
        run: bunx changelogithub
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

#### What It Does

1. Triggered manually via GitHub Actions UI
2. Bumps version in `package.json` (patch/minor/major)
3. Generates `CHANGELOG.md` using git-cliff
4. Publishes to npm with provenance
5. Commits changes and creates version tag
6. Creates GitHub release with changelogithub

#### Required Secrets

| Secret      | Purpose                             |
| ----------- | ----------------------------------- |
| `GH_PAT`    | Personal access token for pushing   |
| `NPM_TOKEN` | npm automation token for publishing |

> **Note:** `GH_PAT` is required to bypass branch protection rules when pushing the release commit.

### Docs Workflow

**File:** `.github/workflows/docs.yml`

Builds and deploys the VitePress documentation site:

```yaml
name: Docs

on:
  push:
    branches: [main]
    paths:
      - "docs/**"
      - ".github/workflows/docs.yml"
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - run: bun run docs:build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v4
        with:
          path: docs/.vitepress/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
    steps:
      - uses: actions/deploy-pages@v4
```

#### Setup Required

1. Go to repo Settings → Pages
2. Set Source to **"GitHub Actions"**

#### What It Does

1. Triggers when `docs/**` files change
2. Builds VitePress site with `bun run docs:build`
3. Deploys to GitHub Pages

## Repository Settings

### Merge Settings

The template recommends squash merging for clean history:

| Setting                | Value       | Purpose                        |
| ---------------------- | ----------- | ------------------------------ |
| Allow squash merging   | ✅ Enabled  | Clean, linear history          |
| Allow merge commits    | ❌ Disabled | Avoid merge commit clutter     |
| Allow rebase merging   | ❌ Disabled | Consistent merge strategy      |
| Delete branch on merge | ✅ Enabled  | Auto-cleanup merged branches   |
| Squash commit title    | PR Title    | Use PR title as commit message |
| Squash commit message  | PR Body     | Include PR description         |

#### Setup with GitHub CLI

```bash
gh api repos/OWNER/REPO -X PATCH \
  -f delete_branch_on_merge=true \
  -f allow_squash_merge=true \
  -f allow_merge_commit=false \
  -f allow_rebase_merge=false \
  -f squash_merge_commit_title=PR_TITLE \
  -f squash_merge_commit_message=PR_BODY
```

### Branch Protection

Protect the `main` branch from direct pushes:

| Setting                | Value      | Purpose                       |
| ---------------------- | ---------- | ----------------------------- |
| Required status checks | `ci`       | CI must pass before merge     |
| Strict status checks   | ✅ Enabled | Branch must be up to date     |
| Dismiss stale reviews  | ✅ Enabled | Re-review after new commits   |
| Required approvals     | 0          | Self-merge allowed (template) |
| Force pushes           | ❌ Blocked | Protect commit history        |
| Deletions              | ❌ Blocked | Prevent accidental deletion   |

#### Setup with GitHub CLI

```bash
gh api repos/OWNER/REPO/branches/main/protection -X PUT \
  --input - << 'EOF'
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["ci"]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "required_approving_review_count": 0,
    "dismiss_stale_reviews": true
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
EOF
```

### GitHub Pages

Enable documentation site deployment:

| Setting | Value                  | Purpose             |
| ------- | ---------------------- | ------------------- |
| Source  | GitHub Actions         | Deploy via workflow |
| URL     | `OWNER.github.io/REPO` | Documentation site  |

#### Setup with GitHub CLI

```bash
gh api repos/OWNER/REPO/pages -X PUT -f build_type=workflow
```

### Features

| Feature     | Status      | Purpose                    |
| ----------- | ----------- | -------------------------- |
| Issues      | ✅ Enabled  | Bug reports and features   |
| Discussions | ✅ Enabled  | Community Q&A              |
| Wiki        | ❌ Disabled | Use VitePress docs instead |

#### Enable Discussions

```bash
gh repo edit OWNER/REPO --enable-discussions
```

## Secrets

Required secrets in repository settings:

| Secret          | Purpose                    | How to Get                    |
| --------------- | -------------------------- | ----------------------------- |
| `GITHUB_TOKEN`  | Auto-provided              | Automatic                     |
| `GH_PAT`        | Push to protected branches | GitHub → Settings → Developer |
| `NPM_TOKEN`     | npm publishing             | npmjs.com → Access Tokens     |
| `CODECOV_TOKEN` | Coverage uploads           | codecov.io → Settings         |

### Adding GH_PAT

1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic) with `repo` scope
3. In repository: Settings → Secrets → Actions → New secret
4. Name: `GH_PAT`, Value: your token

### Adding NPM_TOKEN

1. Go to [npmjs.com](https://www.npmjs.com/) → Access Tokens
2. Generate New Token → Automation
3. In GitHub: Settings → Secrets → Actions → New secret
4. Name: `NPM_TOKEN`, Value: your token

## Customization

### Adding Node.js Matrix

Test on multiple Node versions:

```yaml
jobs:
  build:
    strategy:
      matrix:
        node: [20, 22]
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
```

### Adding Coverage Upload

Upload to Codecov:

```yaml
- name: Upload coverage
  uses: codecov/codecov-action@v4
  with:
    token: ${{ secrets.CODECOV_TOKEN }}
```

### Adding SonarCloud

```yaml
- name: SonarCloud Scan
  uses: SonarSource/sonarcloud-github-action@master
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

## Debugging

### View Workflow Logs

1. Go to Actions tab
2. Click on workflow run
3. Click on job to see logs

### Re-run Failed Workflow

1. Go to failed workflow run
2. Click "Re-run jobs" → "Re-run failed jobs"

### Skip CI

Add `[skip ci]` to commit message:

```bash
git commit -m "docs: update readme [skip ci]"
```
