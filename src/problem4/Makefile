# Three Ways to Sum to n - Makefile
# Streamlined commands for TypeScript development

.PHONY: install build dev test clean help

# Default target
all: install build

# Install dependencies
install:
	npm install

# Build TypeScript to JavaScript
build:
	npm run build

# Run development version with ts-node
dev:
	npm run dev

# Run test suite
test:
	npm test

# Clean build artifacts
clean:
	rm -rf dist/
	rm -rf node_modules/

# Show available commands
help:
	@echo "Available commands:"
	@echo "  make install  - Install npm dependencies"
	@echo "  make build    - Compile TypeScript to JavaScript"
	@echo "  make dev      - Run development version (ts-node)"
	@echo "  make test     - Run test suite"
	@echo "  make clean    - Remove dist/ and node_modules/"
	@echo "  make help     - Show this help message"