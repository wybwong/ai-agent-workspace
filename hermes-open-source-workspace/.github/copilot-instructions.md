# Copilot Instructions

## How this repository works

This repository is a lightweight workspace scaffold for running a personal Hermes-style agent setup on top of upstream open-source Hermes Agent tooling. It is mostly documentation plus helper scripts; the actual agent runtime is installed separately as documented in `docs/setup/open-source-hermes.md`.

At the start of any substantial task, read these files in order:

1. `.github/agents/AGENTS.md`
2. `.github/agents/IDENTITY.md`
3. `.github/agents/SOUL.md`
4. `.github/agents/USER.md`
5. `.github/agents/MEMORY.md`
6. `.github/agents/skills/INDEX.md`

## Commands

Use the built-in helpers to expand the workspace:

```bash
bash scripts/new-project.sh <project-name>
bash scripts/new-skill.sh <skill-name>
```

Use shell syntax checks after editing the helper scripts:

```bash
bash -n scripts/new-project.sh
bash -n scripts/new-skill.sh
```

## Architecture

The repository separates durable agent context from project work. Root entry files (`AGENTS.md`, `CLAUDE.md`) point AI tools to `.github/agents/`, where identity, values, user preferences, memory, and skills live. Real work is tracked under `projects/`, while setup and planning docs live under `docs/`.

The repository intentionally does not embed a specific application stack. Instead, it provides a reusable control plane for future projects. Skills capture repeatable workflows, memory captures durable decisions, and project folders capture per-project context without polluting the global agent identity.

## Conventions

- Keep reusable workflows under `.github/agents/skills/<skill-name>/SKILL.md`.
- Update `.github/agents/skills/INDEX.md` whenever a new skill is added.
- Use `MEMORY.md` only for durable decisions that will still matter in later sessions.
- Put project-specific context in `projects/<project-name>/README.md`, not in the global identity files.
- Keep the repository generic; personalize behavior through `USER.md` and project docs instead of hard-coding one stack into the whole workspace.
