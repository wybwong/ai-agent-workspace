# Hermes Open Source Workspace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone repository scaffold that lets a personal developer pair upstream open-source Hermes Agent tooling with local identity, memory, skills, and project tracking files.

**Architecture:** The repository keeps upstream Hermes runtime installation outside the scaffold and focuses on durable repository-local context. Root entry files direct AI tools into `.github/agents/`, helper scripts create new project and skill folders, and docs explain how the scaffold connects to upstream Hermes Agent and Hermes Workspace.

**Tech Stack:** Markdown, shell scripts, repository conventions

---

### Task 1: Create repository entry files

**Files:**
- Create: `README.md`
- Create: `AGENTS.md`
- Create: `CLAUDE.md`
- Create: `.gitignore`

- [ ] Step 1: Write the root repository overview and quick-start flow.
- [ ] Step 2: Add root AI entry files that redirect sessions into `.github/agents/`.
- [ ] Step 3: Add a lightweight `.gitignore` for common local artifacts.

### Task 2: Create agent context files

**Files:**
- Create: `.github/copilot-instructions.md`
- Create: `.github/agents/AGENTS.md`
- Create: `.github/agents/IDENTITY.md`
- Create: `.github/agents/SOUL.md`
- Create: `.github/agents/USER.md`
- Create: `.github/agents/MEMORY.md`

- [ ] Step 1: Add the Copilot instructions file with repository usage conventions.
- [ ] Step 2: Add the core agent contract and startup file list.
- [ ] Step 3: Add identity, values, user defaults, and starter memory content.

### Task 3: Create starter skills and project tracking

**Files:**
- Create: `.github/agents/skills/INDEX.md`
- Create: `.github/agents/skills/project-starter/SKILL.md`
- Create: `.github/agents/skills/skill-authoring/SKILL.md`
- Create: `projects/README.md`

- [ ] Step 1: Add the skills index with the starter skills.
- [ ] Step 2: Add one skill for creating tracked projects and one for authoring future skills.
- [ ] Step 3: Add the projects README describing per-project tracking.

### Task 4: Add setup docs and helper scripts

**Files:**
- Create: `docs/setup/open-source-hermes.md`
- Create: `scripts/new-project.sh`
- Create: `scripts/new-skill.sh`

- [ ] Step 1: Document how the scaffold pairs with upstream Hermes Agent and Hermes Workspace.
- [ ] Step 2: Add `scripts/new-project.sh` to create `projects/<name>/README.md`.
- [ ] Step 3: Add `scripts/new-skill.sh` to create `.github/agents/skills/<name>/SKILL.md`.

### Task 5: Verify scaffold consistency

**Files:**
- Review: all created files

- [ ] Step 1: Run `bash -n scripts/new-project.sh`.
- [ ] Step 2: Run `bash -n scripts/new-skill.sh`.
- [ ] Step 3: Review the scaffold tree and confirm the documented paths exist.
