# CI/CD Troubleshooting Guide

## Current Status

- ✅ **Frontend Tests**: PASSING
- ❌ **Code Quality**: FAILING
- ❌ **Backend Tests**: FAILING
- ❌ **Docker Build**: FAILING

## Local Test Results

All tests pass locally:

- `flake8`: ✅ PASS (0 errors)
- `pytest`: ✅ PASS (13 passed, 1 skipped)
- Python imports: ✅ All OK

## How to View Actual CI Logs

1. Go to: https://github.com/Baskaran0402/HEALTHCARE_PROJECT/actions
2. Click on the failed workflow run
3. Click on each failed job (code-quality, backend-tests, docker-build)
4. Expand the failed step to see the exact error message

## Common CI Failure Causes

### 1. Missing Environment Variables

The CI might be missing:

- `GROQ_API_KEY`
- `GEMINI_API_KEY`
- `DATABASE_URL`

**Fix**: Add these as GitHub Secrets:

- Go to Settings → Secrets and variables → Actions
- Add repository secrets

### 2. Path Issues

Files moved to `scripts/` and `docs/guides/` might cause import errors.

**Current exclusions in CI**:

```yaml
flake8 src/ backend/ --max-line-length=120 --exclude=venv,scripts
```

### 3. Docker Build Context

The Dockerfile might not find files after reorganization.

**Check**: Ensure `COPY . .` in Dockerfile includes all necessary files.

### 4. Test Database Connection

CI uses PostgreSQL service, connection might fail.

**Check**: Verify `DATABASE_URL` in workflow matches service config.

## Quick Diagnostic Commands

Run these locally to simulate CI:

```bash
# Test flake8 (exactly as CI does)
flake8 src/ backend/ --max-line-length=120 --exclude=venv,scripts

# Test pytest (exactly as CI does)
pytest tests/ -v --cov=src --cov=backend --cov-report=xml

# Test Docker build
docker build -t test-backend -f Dockerfile .
```

## Next Steps

1. **View the actual CI logs** (most important!)
2. Copy the exact error message from GitHub Actions
3. The error will tell us exactly what's wrong

## Files Recently Changed

- Moved documentation to `docs/guides/`
- Moved utility scripts to `scripts/`
- Updated `.github/workflows/ci.yml` to exclude `scripts/`
- Updated `.gitignore` to exclude generated files

## Contact

If CI continues to fail, please share the exact error message from the GitHub Actions log.
