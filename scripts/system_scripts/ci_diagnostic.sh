#!/bin/bash
# CI Diagnostic Script - Run this to simulate CI environment

echo "=== Checking Python Files ==="
find src backend -name "*.py" -type f | head -20

echo -e "\n=== Running Flake8 (CI Command) ==="
flake8 src/ backend/ --max-line-length=120 --exclude=venv,scripts

echo -e "\n=== Checking Test Files ==="
ls -la tests/

echo -e "\n=== Running Tests (CI Command) ==="
pytest tests/ -v --cov=src --cov=backend --cov-report=term

echo -e "\n=== Checking Docker Build ==="
docker build -t test-backend -f Dockerfile . --no-cache

echo -e "\n=== All Checks Complete ==="
