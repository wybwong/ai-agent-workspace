# CLAUDE.md

This repository is a standalone Hermes-style AI workspace.

Load these files at the start of each session:

```text
.github/agents/AGENTS.md
.github/agents/IDENTITY.md
.github/agents/SOUL.md
.github/agents/USER.md
.github/agents/MEMORY.md
.github/agents/skills/INDEX.md
```

When solving a task:

1. Check the skill index first.
2. Reuse an existing skill when one fits.
3. Record stable decisions in `MEMORY.md`.
4. Track concrete work in `projects/<project-name>/README.md`.
