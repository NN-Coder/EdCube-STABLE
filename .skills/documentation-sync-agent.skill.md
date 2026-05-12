# Documentation Sync Agent Skill

## Overview
Keeps project documentation (`README.md`, `roadmap.md`, `AGENTS.md`) in sync with the latest code changes.

## Capabilities
- Update `roadmap.md` status after PR merges.
- Synchronize library versions in `README.md` with `package.json`.
- Maintain the `AGENTS.md` rulebook based on architectural shifts.

## Rules
- UPDATE documentation as the FINAL STEP of every task.
- USE standardized formatting (e.g., [DONE] prefix in roadmap).
- ENSURE all internal links (file links) are valid.
- SUMMARIZE changes in a "Changelog" section if applicable.
