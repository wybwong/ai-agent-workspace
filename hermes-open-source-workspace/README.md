# Hermes Open Source Workspace

An independent, reusable repository scaffold for running a personal AI workspace on top of the upstream open-source **Hermes Agent** ecosystem.

This repository does **not** vendor Hermes Agent itself. Instead, it gives you a durable workspace structure for:

- agent identity and behavior rules
- long-term memory files
- reusable local skills
- project tracking
- editor entry files for Copilot and Claude Code
- helper scripts for adding new projects and skills

## Upstream runtime

This scaffold is designed to pair with:

- `NousResearch/hermes-agent`
- `outsourc-e/hermes-workspace` (optional web UI)

Setup notes live in `docs/setup/open-source-hermes.md`.

## Quick start

1. Copy this directory into a new repository root.
2. Read `docs/setup/open-source-hermes.md` and install the upstream runtime you want to use.
3. Edit these files first:
   - `.github/agents/IDENTITY.md`
   - `.github/agents/SOUL.md`
   - `.github/agents/USER.md`
4. Add your first tracked project:

   ```bash
   bash scripts/new-project.sh my-first-project
   ```

5. Add your first reusable skill:

   ```bash
   bash scripts/new-skill.sh repo-bootstrap
   ```

## Repository layout

```text
.
├── AGENTS.md
├── CLAUDE.md
├── .github/
│   ├── copilot-instructions.md
│   └── agents/
│       ├── AGENTS.md
│       ├── IDENTITY.md
│       ├── SOUL.md
│       ├── USER.md
│       ├── MEMORY.md
│       └── skills/
│           ├── INDEX.md
│           └── <skill-name>/SKILL.md
├── docs/
│   ├── setup/
│   └── superpowers/plans/
├── projects/
└── scripts/
```

## Intended workflow

1. Load the agent identity and memory files at the start of each session.
2. Check `.github/agents/skills/INDEX.md` before implementing anything substantial.
3. Track each real project under `projects/<project-name>/README.md`.
4. When a new pattern proves reusable, turn it into a skill under `.github/agents/skills/`.
5. When a decision will matter later, record it in `.github/agents/MEMORY.md`.

## Validation

The scaffold is intentionally lightweight. The most useful built-in checks are:

```bash
bash -n scripts/new-project.sh
bash -n scripts/new-skill.sh
```

## Customization boundary

Keep this repository generic. Put personal preferences in `USER.md`, durable principles in `SOUL.md`, and repo-specific conventions in project docs or skills instead of hard-coding them into every instruction file.
