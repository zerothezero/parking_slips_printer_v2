# Push Staged Codes Slash Command

This slash command commits only the staged changes you selected with a descriptive message based on the actual changes, pushes to remote "origin", and fetches all remotes to update the git timeline.

## Workflow Steps:
1. Check what's currently staged and analyze changes
2. Create descriptive commit message based on actual staged changes
3. Push to origin
4. Fetch all remotes to update git timeline

## Implementation:

Check current git status and analyze staged changes:
```bash
git status
git diff --staged
```

Analyze the staged changes and create descriptive commit based on what was actually changed:
```bash
git commit -m "$(cat <<'EOF'
[Analyze staged changes and create appropriate commit message]

- [Describe specific changes made]
- [List key modifications]
- [Note any bug fixes or improvements]

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

Push to origin and fetch all remotes:
```bash
git push origin $(git branch --show-current)
git fetch --all
```

Show final status:
```bash
git status
git log --oneline -5
```