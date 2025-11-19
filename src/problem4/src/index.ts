/**
 * Problem 4: Three Ways to Sum to n - TypeScript Implementation
 * This module provides three unique implementations to calculate the sum from 1 to n.
 */

/**
 * Approach A: Iterative Solution
 *
 * Time Complexity: O(n) - Linear time, iterates through all numbers from 1 to n
 * Space Complexity: O(1) - Constant space, uses only a single accumulator variable
 */
function sum_to_n_a(n: number): number {
  if (n < 0) throw new Error("n must be non-negative");
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

/**
 * Approach B: Mathematical Formula (Gauss's Formula)
 *
 * Time Complexity: O(1) - Constant time, single arithmetic operation
 * Space Complexity: O(1) - Constant space, no additional memory needed
 */
function sum_to_n_b(n: number): number {
  if (n < 0) throw new Error("n must be non-negative");
  return (n * (n + 1)) / 2;
}

/**
 * Approach C: Recursive Solution
 *
 * Time Complexity: O(n) - Linear time, makes n recursive function calls
 * Space Complexity: O(n) - Linear space due to call stack (each call uses stack memory) -> Not suitable for large n due to stack depth.
 */
function sum_to_n_c(n: number): number {
  if (n < 0) throw new Error("n must be non-negative");
  if (n <= 1) {
    return n;
  }
  return n + sum_to_n_c(n - 1);
}

/**
 * Demo function to showcase all three implementations
 */
function demonstrateImplementations(): void {
  const testValues = [0, 1, 5, 10, 100];

  console.log("=== Three Ways to Sum to n - Demonstration ===\n");

  testValues.forEach((n) => {
    console.log(`For n = ${n}:`);
    console.log(`  Iterative (A): ${sum_to_n_a(n)}`);
    console.log(`  Formula (B):   ${sum_to_n_b(n)}`);
    console.log(`  Recursive (C): ${sum_to_n_c(n)}`);
    console.log();
  });

  // Performance comparison for larger values
  console.log("=== Performance Comparison ===");
  const largeN = 10000;

  console.time("Iterative Approach");
  const resultA = sum_to_n_a(largeN);
  console.timeEnd("Iterative Approach");

  console.time("Mathematical Formula");
  const resultB = sum_to_n_b(largeN);
  console.timeEnd("Mathematical Formula");

  console.time("Recursive Approach (smaller n=1000 to avoid stack overflow)");
  const resultC = sum_to_n_c(1000);
  console.timeEnd("Recursive Approach (smaller n=1000 to avoid stack overflow)");

  console.log(`\nResults for n=${largeN}: A=${resultA}, B=${resultB}`);
  console.log(`Result for n=1000 (recursive): C=${resultC}`);
}

// Export the functions for testing
export { sum_to_n_a, sum_to_n_b, sum_to_n_c };

// Run demonstration if this file is executed directly
if (require.main === module) {
  demonstrateImplementations();
}
