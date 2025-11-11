# Development Workflow

Guidelines for contributing code to the CrewX project.

## Overview

CrewX development follows an AI-agent collaborative approach with clear workflows for bug fixes, feature development, and releases.

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Git
- Understanding of TypeScript and npm workspaces

### Initial Setup

```bash
# Fork and clone
git clone https://github.com/<your-username>/crewx.git
cd crewx

# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
npm test
```

## Development Process

### Branch Strategy

```
main (production, always stable)
  ↑
develop (development integration)
  ↑
release/X.X.X-rc.N (release candidates)
  ↑
bugfix/HASH (bug fixes from main)
feature/name (features from main)
hotfix/name (urgent fixes from main)
```

**Branch Naming:**
- `bugfix/HASH` - Bug fixes (branched from main)
- `feature/name` - New features (branched from main)
- `hotfix/name` - Urgent fixes (branched from main)
- `release/X.X.X-rc.N` - Release candidates (branched from develop)

### Commit Messages

Follow conventional commits:

```bash
feat: add new feature
fix: resolve bug
docs: update documentation
test: add tests
refactor: improve code structure
chore: update dependencies
```

## Bug Fix Workflow

### 1. Report Bug

Create an issue with:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Environment details

### 2. Fix Bug

```bash
# Create bugfix branch from main
git checkout main
git pull origin main
git checkout -b bugfix/description

# Make changes
# ... edit files ...

# Commit
git add .
git commit -m "fix: resolve description"

# Push
git push origin bugfix/description
```

### 3. Create Pull Request

- Reference issue number
- Describe changes
- Add tests if applicable
- Update documentation

## Feature Development

### 1. Propose Feature

- Discuss in GitHub Issues or Discussions
- Get feedback from maintainers
- Align with project goals

### 2. Implement Feature

```bash
# Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/feature-name

# Develop feature
# ... implement ...

# Test thoroughly
npm test

# Commit
git commit -m "feat: add feature-name"

# Push
git push origin feature/feature-name
```

### 3. Submit Pull Request

- Describe feature and use cases
- Include documentation
- Add tests
- Update CHANGELOG

## Testing

### Run Tests

```bash
# All tests
npm test

# Specific package
npm test --workspace @sowonai/crewx-sdk
npm test --workspace crewx

# Watch mode
npm test -- --watch
```

### Test Coverage

Ensure good test coverage for:
- New features
- Bug fixes
- Edge cases
- Error handling

## Code Quality

### Linting

```bash
# Lint code
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

### Type Checking

```bash
# Type check
npm run type-check
```

## Release Process

### Release Candidates (RC)

```bash
# Create RC branch from develop
git checkout develop
git checkout -b release/X.X.X-rc.N

# Update version
npm version X.X.X-rc.N

# Build and test
npm run build
npm test

# Publish RC
npm publish --tag next

# Merge to develop
git checkout develop
git merge release/X.X.X-rc.N
git push origin develop
```

### Official Release

```bash
# Create release branch
git checkout develop
git checkout -b release/X.X.X

# Update version
npm version X.X.X

# Build and test
npm run build
npm test

# Publish
npm publish

# Merge to develop and main
git checkout develop
git merge release/X.X.X
git push origin develop

git checkout main
git merge release/X.X.X
git push origin main

# Create GitHub release
# Add release notes and changelog
```

## Documentation

### Update Documentation

- Keep docs in sync with code changes
- Update README for new features
- Add examples for complex features
- Update API documentation

### Doc Structure

- `README.md` - Project overview
- `docs/` - Detailed documentation
- `packages/*/README.md` - Package-specific docs
- `CONTRIBUTING.md` - Contribution guidelines

## Getting Help

- GitHub Issues - Bug reports and feature requests
- GitHub Discussions - Questions and community help
- Check existing issues before creating new ones

## Code Review

Pull requests will be reviewed for:
- Code quality and style
- Test coverage
- Documentation updates
- Breaking changes
- Performance impact

## Best Practices

### Code Style

- Follow existing code patterns
- Use TypeScript strictly
- Write self-documenting code
- Add comments for complex logic

### Git Workflow

- Keep commits focused and atomic
- Write clear commit messages
- Rebase before merging
- Keep branches up to date

### Testing

- Write tests first (TDD when applicable)
- Test edge cases
- Mock external dependencies
- Maintain high coverage

## Additional Resources

For more detailed information, see:
- [Contributing Guide](./guide.md)
- [CrewX GitHub Repository](https://github.com/sowonlabs/crewx)
- Project README files
- Issue templates

---

**Questions?** Open an issue or discussion on GitHub!
