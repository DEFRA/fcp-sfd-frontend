# AI customization review rules

Applies when the change touches `.github/copilot-instructions.md`, `.github/instructions/*.instructions.md`, or `.github/skills/**/SKILL.md` and when it changes code that an existing instruction file describes.

- Every rule is verifiable in the code today. Open the file it cites and confirm the macro signature, symbol, option, or path actually exists.
- Examples match real call sites rather than an idealised version, and cover the variants in use.
- `applyTo` globs match the files the conventions actually govern.
- No rule contradicts another instruction file or `copilot-instructions.md`.
- Changing a layer that has an instruction file means checking that instruction still holds.
