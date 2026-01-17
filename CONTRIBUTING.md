# Contributing to AI Doctor Assistant

Thank you for your interest in contributing to the AI Doctor Assistant project! This document provides guidelines for contributing.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Prioritize patient safety and medical ethics
- Follow healthcare AI best practices

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Python version, etc.)

### Suggesting Enhancements

1. Open an issue with the "enhancement" label
2. Describe the feature and its benefits
3. Provide use cases and examples

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`pytest`)
6. Update documentation as needed
7. Commit with clear messages
8. Push to your fork
9. Open a Pull Request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/HEALTHCARE_PROJECT.git
cd HEALTHCARE_PROJECT

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
pip install -r requirements-dev.txt

# Run tests
pytest
```

## Coding Standards

### Python Code

- Follow PEP 8 style guide
- Use type hints where appropriate
- Write docstrings for functions and classes
- Keep functions focused and modular

### React/JavaScript Code

- Use functional components with hooks
- Follow ESLint configuration
- Write meaningful component names
- Keep components small and reusable

### Testing

- Write unit tests for new features
- Maintain >80% code coverage
- Test edge cases and error handling
- Use meaningful test names

### Documentation

- Update README.md for major changes
- Add docstrings to new functions
- Include code examples where helpful
- Keep documentation clear and concise

## Medical AI Safety Guidelines

When contributing to this healthcare AI project:

1. **Never** add features that provide medical diagnosis
2. **Never** add prescription or dosage recommendations
3. **Always** include appropriate disclaimers
4. **Always** prioritize explainability over accuracy
5. **Always** consider patient safety implications

## Commit Message Format

```
type(scope): brief description

Detailed explanation of changes (if needed)

Fixes #issue_number
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:

```
feat(agents): add kidney disease prediction model

- Implemented KidneyAgent with creatinine-based risk assessment
- Added unit tests with 85% coverage
- Updated documentation

Fixes #42
```

## Questions?

Feel free to open an issue with the "question" label or reach out to the maintainers.

Thank you for contributing to healthcare AI innovation! 🩺
