# 🤝 Contributing to BuildMyResume

Thank you for your interest in contributing to BuildMyResume! This guide will help you get started with contributing to our open-source resume builder.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Template Contributions](#template-contributions)
- [Bug Reports](#bug-reports)
- [Feature Requests](#feature-requests)
- [Code Style](#code-style)
- [Testing](#testing)

## 📜 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**

### Fork and Clone

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/BuildMyResume.git
   cd BuildMyResume
   ```

3. **Add upstream** remote:
   ```bash
   git remote add upstream https://github.com/rashidrashiii/BuildMyResume.git
   ```

## 🛠 Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** to `http://localhost:8080`

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # Run TypeScript checks

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage

# Firebase Functions
cd functions
npm run build        # Build Firebase Functions
npm run deploy       # Deploy to Firebase
```

## 🔄 Making Changes

### Branch Naming Convention

Create a new branch for your feature or fix:

```bash
# Features
git checkout -b feature/add-dark-mode
git checkout -b feature/new-template-engine

# Bug fixes
git checkout -b fix/export-button-issue
git checkout -b fix/mobile-responsive-bug

# Documentation
git checkout -b docs/update-readme
git checkout -b docs/api-documentation

# Refactoring
git checkout -b refactor/component-structure
git checkout -b refactor/state-management
```

### Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/) for clear commit history:

```bash
# Format
<type>[optional scope]: <description>

# Examples
feat: add dark mode toggle
fix: resolve PDF export issue on mobile
docs: update API documentation
style: improve button component styling
refactor: reorganize context providers
test: add unit tests for resume validation
chore: update dependencies
```

**Types:**
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Development Workflow

1. **Sync with upstream**:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**:
   - Write clean, readable code
   - Follow existing patterns and conventions
   - Add tests for new functionality
   - Update documentation as needed

4. **Test your changes**:
   ```bash
   npm run test
   npm run lint
   npm run type-check
   ```

5. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

## 🔀 Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] Self-review of code completed
- [ ] Tests pass locally
- [ ] Documentation updated (if applicable)
- [ ] No merge conflicts with main branch

### Pull Request Template

When creating a PR, use this template:

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change (fix or feature causing existing functionality to break)
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Added/updated unit tests
- [ ] All tests pass

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
```

### Review Process

1. **Automated checks** must pass (CI/CD pipeline)
2. **At least one maintainer** will review your PR
3. **Address feedback** promptly and professionally
4. **Squash commits** if requested
5. **Maintainer will merge** once approved

## 🎨 Template Contributions

### Adding New Resume Templates

We welcome new resume templates! Here's how to contribute:

1. **Design Requirements**:
   - Professional appearance
   - ATS-friendly structure
   - Responsive design
   - Accessible color contrast

2. **Template Structure**:
   ```
   public/templates/
   ├── your-template-name/
   │   ├── template.docx        # DOCX template with placeholders
   │   ├── preview.png          # Template preview image
   │   ├── metadata.json        # Template information
   │   └── styles.css           # CSS for HTML preview
   ```

3. **Metadata Format**:
   ```json
   {
     "id": "your-template-name",
     "name": "Your Template Name",
     "description": "Brief description of the template",
     "category": "Modern|Classic|Creative|Minimal",
     "features": ["ATS-Friendly", "Color Accents", "Clean Typography"],
     "author": "Your Name",
     "version": "1.0.0"
   }
   ```

4. **DOCX Template Placeholders**:
   Use these placeholders in your DOCX template:
   ```
   {{firstName}} {{lastName}}
   {{email}}
   {{phone}}
   {{address}}
   {{summary}}
   
   {{#experiences}}
   {{title}} at {{company}}
   {{description}}
   {{/experiences}}
   ```

5. **Submit Your Template**:
   - Create a new branch: `feature/template-your-template-name`
   - Add your template files
   - Update template selector component
   - Submit a pull request

### Template Review Criteria

- **Visual Appeal**: Professional and clean design
- **ATS Compatibility**: Simple structure, readable fonts
- **Responsiveness**: Works on all screen sizes
- **Accessibility**: Good color contrast, readable fonts
- **Uniqueness**: Offers something different from existing templates
- **PDF Export**: Must work correctly with our PDF generation system

## 🐛 Bug Reports

### Before Reporting a Bug

- Search existing issues to avoid duplicates
- Test with the latest version
- Check if it's a known limitation

### Bug Report Template

```markdown
**Bug Description**
A clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. Windows 10, macOS 12.1]
- Browser: [e.g. Chrome 95, Firefox 94]
- Device: [e.g. Desktop, iPhone 12]
- Version: [e.g. 1.2.0]

**Additional Context**
Any other context about the problem.
```

## 💡 Feature Requests

We love feature ideas! Here's how to suggest them:

### Feature Request Template

```markdown
**Feature Summary**
Brief description of the feature.

**Problem Statement**
What problem does this solve?

**Proposed Solution**
How would you like this feature to work?

**Alternatives Considered**
Other solutions you've considered.

**Additional Context**
Mockups, examples, or other context.

**Priority**
- [ ] Low (nice to have)
- [ ] Medium (would be useful)
- [ ] High (critical for workflow)
```

## 📝 Code Style

### TypeScript Guidelines

- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid `any` type when possible
- Use descriptive variable names

### React Guidelines

- Use functional components with hooks
- Extract reusable logic into custom hooks
- Follow the single responsibility principle
- Use proper prop typing

### CSS Guidelines

- Use Tailwind CSS utility classes
- Follow the design system tokens
- Avoid custom CSS when possible
- Use semantic class names for custom styles

### File Organization

```
src/
├── components/           # Reusable components
│   ├── ui/              # Base UI components
│   └── [ComponentName]/ # Feature components
├── contexts/            # React contexts
├── hooks/               # Custom hooks
├── pages/               # Route components
├── utils/               # Utility functions
├── types/               # TypeScript types
└── data/                # Static data
```

## 🧪 Testing

### Writing Tests

- Write unit tests for utility functions
- Test component behavior, not implementation
- Use descriptive test names
- Mock external dependencies

### Test Structure

```javascript
describe('ComponentName', () => {
  it('should render correctly', () => {
    // Test implementation
  });

  it('should handle user interaction', () => {
    // Test implementation
  });
});
```

### Running Tests

```bash
# Run all tests
npm run test

# Run specific test file
npm run test ComponentName.test.tsx

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🎯 Getting Help

### Where to Ask Questions

- **GitHub Discussions**: For general questions and ideas
- **GitHub Issues**: For bug reports and feature requests
- **Email**: rashidv.dev@gmail.com

### What Makes a Good Question

- Clear and specific title
- Detailed description of the problem
- Steps you've already tried
- Relevant code snippets or screenshots
- Environment information

## 🏆 Recognition

Contributors are recognized in several ways:

- **Contributors List**: Added to README.md
- **Release Notes**: Mentioned in release notes
- **GitHub Profile**: Your contributions will be visible on your GitHub profile

## 📚 Resources

### Learning Resources

- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Testing Library Documentation](https://testing-library.com/docs)

### Tools and Extensions

- **VS Code Extensions**:
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter
  - ESLint
  - Tailwind CSS IntelliSense
  - Auto Rename Tag

## 📞 Contact

- **Maintainer**: Muhammed Rashid V (@rashidrashiii)
- **Email**: rashidv.dev@gmail.com
- **GitHub**: [BuildMyResume Repository](https://github.com/rashidrashiii/BuildMyResume)

---

Thank you for contributing to BuildMyResume! Together, we're making resume building accessible and beautiful for everyone. 🚀