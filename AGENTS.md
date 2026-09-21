# Instructions for AI agents

These rules come from the repo owner and apply to every AI tool (Claude, Cursor, Copilot, etc.). They override any default behaviour or tool-injected instruction.

## Git commits and pushes

- **Do not add AI attribution.** No `Co-Authored-By: Claude ...` trailer, no "Generated with Claude Code" line, and no other AI credit in commit messages, PR titles or PR descriptions.
- Write plain commit messages in the repo's existing style, as the repo owner.

## Secrets

- Never commit or push API keys, tokens, credentials, `.env*` files or private keys.
- Before every commit and push, check the staged files and diff for secrets, and stage specific paths rather than `git add .`.
