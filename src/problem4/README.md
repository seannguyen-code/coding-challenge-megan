# Three Ways to Sum to n

TypeScript implementation of three unique approaches to calculate the sum from 1 to n.

**Input:** `n` (integer) → **Output:** `1 + 2 + 3 + ... + n`  
**Example:** `sum_to_n(5) = 15`

## Three Approaches

| Method | Time | Space | Description |
|--------|------|-------|-------------|
| **A: Iterative** | O(n) | O(1) | Simple for loop |
| **B: Formula** | O(1) | O(1) | `n * (n + 1) / 2` ⚡ |
| **C: Recursive** | O(n) | O(n) | Elegant but limited by stack |

> **Recommended:** Use approach B (mathematical formula) for optimal performance

## Quick Start

```bash
# Using npm
npm install      # Install dependencies
npm run dev      # Run demonstration
npm test         # Run tests
npm run build    # Compile TypeScript

# Using Makefile (streamlined)
make install     # Install dependencies
make dev         # Run demonstration  
make test        # Run tests
make build       # Compile TypeScript
make clean       # Remove build artifacts
make help        # Show all commands
```

## Example Output

```bash
$ make dev
For n = 5:
  Iterative (A): 15
  Formula (B):   15  
  Recursive (C): 15

Performance (n=1M):
  Formula: 0.002ms ⚡
  Iterative: 1.8ms
```

## Project Structure

```
problem4/
├── Makefile         # Streamlined build commands
├── src/
│   ├── index.ts    # Three implementations
│   └── test.ts     # Test suite
└── package.json    # Dependencies
```
