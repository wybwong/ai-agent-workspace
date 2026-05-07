# MEMORY.md

## Purpose

Use this file for decisions and patterns that should survive across sessions.

Good entries:

- a stable deployment choice
- a preferred testing strategy
- a repository structure rule
- a reusable naming convention

Do not use this file for temporary todos.

## History

### 2026-05-08: Initialized standalone Hermes workspace scaffold

- Decision: keep the repository generic and pair it with upstream open-source Hermes Agent tooling instead of vendoring the runtime.
- Reason: the workspace should stay portable, easy to update, and focused on local context, skills, and project tracking.
- Impact: future users install Hermes Agent or Hermes Workspace separately, then customize the repository files for their own workflow.
