# Open-Source Hermes Setup

This workspace scaffold is meant to sit beside the upstream Hermes runtime, not replace it.

## Upstream repositories

- Hermes Agent: `https://github.com/NousResearch/hermes-agent`
- Hermes Workspace: `https://github.com/outsourc-e/hermes-workspace`

## Install Hermes Agent

Follow the upstream quickstart:

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

After installation, verify the runtime using the upstream documentation for the version you installed.

## Install Hermes Workspace (optional)

If you want the web UI as well:

```bash
curl -fsSL https://hermes-workspace.com/install.sh | bash
```

## How this scaffold fits in

Use the upstream runtime for execution, tools, memory engines, and UI. Use this repository for:

- your local agent identity
- repository-specific skills
- durable decision records
- tracked projects
- editor entry files

## Recommended adoption order

1. Install Hermes Agent.
2. Copy this scaffold into a fresh repository.
3. Personalize `.github/agents/IDENTITY.md`, `SOUL.md`, and `USER.md`.
4. Create your first project folder.
5. Add skills only after a workflow proves repeatable.

## Upgrade strategy

Keep upstream Hermes upgrades separate from repository-local process changes. That way you can update Hermes Agent without rewriting your identity, memory, or skill files every time.
