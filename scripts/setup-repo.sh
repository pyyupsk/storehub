#!/usr/bin/env bash
# Setup repository settings using GitHub CLI
# Usage: ./scripts/setup-repo.sh [owner/repo]

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get repo from argument or detect from git remote
if [[ $# -ge 1 ]]; then
  REPO="$1"
else
  REPO=$(gh repo view --json nameWithOwner -q '.nameWithOwner' 2>/dev/null || true)
  if [[ -z "$REPO" ]]; then
    echo -e "${RED}Error: Could not detect repository. Please provide owner/repo as argument.${NC}"
    exit 1
  fi
fi

echo -e "${BLUE}Setting up repository: ${REPO}${NC}\n"

# Function to run gh api with error handling
run_api() {
  local description="$1"
  shift
  echo -n "  $description... "
  if "$@" >/dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
    return 0
  else
    echo -e "${YELLOW}⚠ skipped${NC}"
    return 1
  fi
}

# =============================================================================
# Security Settings
# =============================================================================
echo -e "${BLUE}[1/7] Security Settings${NC}"

run_api "Enable Dependabot alerts" \
  gh api "repos/${REPO}/vulnerability-alerts" -X PUT

run_api "Enable Dependabot security updates" \
  gh api "repos/${REPO}/automated-security-fixes" -X PUT

run_api "Enable secret scanning" \
  gh api "repos/${REPO}" -X PATCH --input - <<EOF
{
  "security_and_analysis": {
    "secret_scanning": { "status": "enabled" },
    "secret_scanning_push_protection": { "status": "enabled" }
  }
}
EOF

echo ""

# =============================================================================
# Merge Settings
# =============================================================================
echo -e "${BLUE}[2/6] Merge Settings${NC}"

run_api "Configure merge options (squash only, delete branch)" \
  gh api "repos/${REPO}" -X PATCH \
    -f delete_branch_on_merge=true \
    -f allow_squash_merge=true \
    -f allow_merge_commit=false \
    -f allow_rebase_merge=false \
    -f allow_auto_merge=true \
    -f squash_merge_commit_title=PR_TITLE \
    -f squash_merge_commit_message=PR_BODY

echo ""

# =============================================================================
# Repository Features
# =============================================================================
echo -e "${BLUE}[3/6] Repository Features${NC}"

run_api "Enable issues" \
  gh api "repos/${REPO}" -X PATCH -f has_issues=true

run_api "Disable wiki (use VitePress docs)" \
  gh api "repos/${REPO}" -X PATCH -f has_wiki=false

run_api "Disable projects" \
  gh api "repos/${REPO}" -X PATCH -f has_projects=false

echo ""

# =============================================================================
# GitHub Pages
# =============================================================================
echo -e "${BLUE}[4/6] GitHub Pages${NC}"

run_api "Enable GitHub Pages (Actions source)" \
  gh api "repos/${REPO}/pages" -X PUT -f build_type=workflow

echo ""

# =============================================================================
# Branch Protection (Rulesets)
# =============================================================================
echo -e "${BLUE}[5/6] Branch Protection${NC}"

# Get repo ID for rulesets API
REPO_ID=$(gh api "repos/${REPO}" --jq '.id' 2>/dev/null || true)

if [[ -n "$REPO_ID" ]]; then
  # Check if ruleset already exists
  EXISTING_RULESET=$(gh api "repos/${REPO}/rulesets" --jq '.[] | select(.name == "main-protection") | .id' 2>/dev/null || true)

  if [[ -n "$EXISTING_RULESET" ]]; then
    echo -e "  Ruleset 'main-protection' already exists... ${YELLOW}⚠ skipped${NC}"
  else
    echo -n "  Create branch ruleset for main... "
    if gh api "repos/${REPO}/rulesets" -X POST --input - <<RULESET >/dev/null 2>&1
{
  "name": "main-protection",
  "target": "branch",
  "enforcement": "active",
  "conditions": {
    "ref_name": {
      "include": ["refs/heads/main"],
      "exclude": []
    }
  },
  "rules": [
    {
      "type": "deletion"
    },
    {
      "type": "non_fast_forward"
    },
    {
      "type": "pull_request",
      "parameters": {
        "required_approving_review_count": 0,
        "dismiss_stale_reviews_on_push": true,
        "require_last_push_approval": false,
        "required_review_thread_resolution": false
      }
    },
    {
      "type": "required_status_checks",
      "parameters": {
        "strict_required_status_checks_policy": true,
        "required_status_checks": [
          {
            "context": "ci"
          }
        ]
      }
    }
  ],
  "bypass_actors": [
    {
      "actor_id": 5,
      "actor_type": "RepositoryRole",
      "bypass_mode": "always"
    }
  ]
}
RULESET
    then
      echo -e "${GREEN}✓${NC}"
    else
      echo -e "${YELLOW}⚠ skipped${NC}"
    fi
  fi
else
  echo -e "  Could not get repository ID... ${YELLOW}⚠ skipped${NC}"
fi

echo ""

# =============================================================================
# Labels
# =============================================================================
echo -e "${BLUE}[6/6] Issue Labels${NC}"

# Create common labels
create_label() {
  local name="$1"
  local color="$2"
  local description="$3"
  run_api "Create label: $name" \
    gh api "repos/${REPO}/labels" -X POST \
      -f name="$name" \
      -f color="$color" \
      -f description="$description"
}

create_label "bug" "d73a4a" "Something isn't working" || true
create_label "enhancement" "a2eeef" "New feature or request" || true
create_label "documentation" "0075ca" "Improvements or additions to documentation" || true
create_label "good first issue" "7057ff" "Good for newcomers" || true
create_label "help wanted" "008672" "Extra attention is needed" || true
create_label "breaking" "b60205" "Breaking change" || true
create_label "dependencies" "0366d6" "Dependency updates" || true

echo ""

# =============================================================================
# Summary
# =============================================================================
echo -e "${GREEN}Repository setup complete!${NC}"
echo ""
echo -e "${YELLOW}Manual steps required:${NC}"
echo "  1. Add secrets in Settings → Secrets → Actions:"
echo "     - NPM_TOKEN: npm automation token"
echo "     - GH_PAT: Personal access token with 'repo' scope"
echo ""
echo -e "  2. Visit: ${BLUE}https://github.com/${REPO}/settings${NC}"
