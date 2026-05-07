#!/usr/bin/env bash

set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: bash scripts/new-project.sh <project-name>" >&2
  exit 1
fi

project_name="$1"
project_dir="projects/$project_name"
readme_path="$project_dir/README.md"

if [[ -e "$project_dir" ]]; then
  echo "Project already exists: $project_dir" >&2
  exit 1
fi

mkdir -p "$project_dir"

cat > "$readme_path" <<EOF
# $project_name

## Summary

- Problem:
- Owner:
- Status: planned

## Stack

- Runtime:
- Framework:
- Storage:

## Commands

- Install:
- Build:
- Test:
- Deploy:

## Decisions

- No durable decisions recorded yet.

## Open questions

- None yet.
EOF

echo "Created $readme_path"
