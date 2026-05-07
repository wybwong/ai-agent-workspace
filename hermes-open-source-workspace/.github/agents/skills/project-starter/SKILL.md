# project-starter

## Purpose

Start a new tracked project in this workspace without skipping the durable setup work.

## Use when

- a new application, service, automation, or research effort starts
- the repository owner wants project context tracked outside chat

## Workflow

1. Create `projects/<project-name>/README.md`.
2. Record:
   - problem statement
   - current status
   - stack
   - commands
   - deployment target
   - key open questions
3. Add any project-specific instructions or conventions to the project README, not to global identity files.
4. If the project produces a repeatable workflow, extract it into a new skill later.

## Example

```bash
bash scripts/new-project.sh customer-portal
```
