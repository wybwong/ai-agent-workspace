#!/usr/bin/env bash

set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: bash scripts/new-skill.sh <skill-name>" >&2
  exit 1
fi

skill_name="$1"
skill_dir=".github/agents/skills/$skill_name"
skill_path="$skill_dir/SKILL.md"

if [[ -e "$skill_dir" ]]; then
  echo "Skill already exists: $skill_dir" >&2
  exit 1
fi

mkdir -p "$skill_dir"

cat > "$skill_path" <<EOF
# $skill_name

## Purpose

Describe the reusable workflow this skill captures.

## Use when

- Add concrete triggers here.

## Workflow

1. Define the inputs.
2. Perform the reusable steps.
3. Record durable outputs.

## Example

\`\`\`bash
# Add a concrete example here.
\`\`\`
EOF

echo "Created $skill_path"
