# skill-authoring

## Purpose

Create a reusable local skill from a workflow that appears more than once.

## Use when

- the same sequence of steps keeps repeating
- the repository owner wants future sessions to reuse a proven workflow

## Workflow

1. Create `.github/agents/skills/<skill-name>/`.
2. Add `SKILL.md` with:
   - purpose
   - use cases
   - inputs
   - outputs
   - workflow
   - examples
3. Keep any helper files in the same skill directory.
4. Update `.github/agents/skills/INDEX.md`.
5. Record any cross-project decision in `MEMORY.md` if it will matter later.

## Example

```bash
bash scripts/new-skill.sh changelog-maintainer
```
