/**
 * Test Suite for Three Ways to Sum to n
 *
 * This file contains comprehensive tests to verify that all three implementations
 * produce the same correct results for various input values.
 */

import { sum_to_n_a, sum_to_n_b, sum_to_n_c } from "./index";

/**
 * Simple test runner function
 */
function runTests(): void {
  console.log("=== Running Tests for Sum to n Implementations ===\n");

  let passedTests = 0;
  let totalTests = 0;

  // Test cases: [input, expected_output]
  const testCases: [number, number][] = [
    [0, 0], // Edge case: sum to 0w
    [1, 1], // Edge case: sum to 1
    [2, 3], // Small case: 1 + 2 = 3
    [3, 6], // Small case: 1 + 2 + 3 = 6
    [5, 15], // Given example: 1 + 2 + 3 + 4 + 5 = 15
    [10, 55], // Medium case: sum to 10
    [100, 5050], // Larger case: sum to 100
  ];

  // Positive / zero tests
  testCases.forEach(([input, expected], index) => {
    totalTests++;
    console.log(`Test ${index + 1}: sum_to_n(${input}) should equal ${expected}`);

    try {
      const resultA = sum_to_n_a(input);
      const resultB = sum_to_n_b(input);
      const resultC = sum_to_n_c(input);

      console.log(`  Iterative (A): ${resultA}`);
      console.log(`  Formula (B):   ${resultB}`);
      console.log(`  Recursive (C): ${resultC}`);

      const allMatch = resultA === expected && resultB === expected && resultC === expected;

      if (allMatch) {
        console.log(`  ✅ PASS - All implementations correct\n`);
        passedTests++;
      } else {
        console.log(`  ❌ FAIL - Expected ${expected}\n`);
      }
    } catch (error) {
      console.log(`  ❌ ERROR - Unexpected exception: ${error}\n`);
    }
  });

  // Negative input error tests
  console.log("=== Negative Input Error Tests ===");

  const negativeInputs = [-1, -5, -100];

  negativeInputs.forEach((input, idx) => {
    totalTests++;
    console.log(`Error Test ${idx + 1}: sum_to_n(${input}) should throw`);

    const tests: [string, () => number][] = [
      ["Iterative (A)", () => sum_to_n_a(input)],
      ["Formula (B)", () => sum_to_n_b(input)],
      ["Recursive (C)", () => sum_to_n_c(input)],
    ];

    let allThrew = true;

    tests.forEach(([label, fn]) => {
      try {
        fn();
        console.log(`  ❌ FAIL - ${label} did NOT throw`);
        allThrew = false;
      } catch {
        console.log(`  ✅ PASS - ${label} threw as expected`);
      }
    });

    if (allThrew) {
      passedTests++;
      console.log("  ✅ Overall: All implementations threw as expected\n");
    } else {
      console.log("  ❌ Overall: At least one implementation failed to throw\n");
    }
  });

  // Performance test
  console.log("=== Performance Test ===");
  const performanceN = 1000000; // 1 million

  console.log(`Testing performance with n = ${performanceN}`);

  console.time("Iterative Approach (1M)");
  const perfResultA = sum_to_n_a(performanceN);
  console.timeEnd("Iterative Approach (1M)");

  console.time("Mathematical Formula (1M)");
  const perfResultB = sum_to_n_b(performanceN);
  console.timeEnd("Mathematical Formula (1M)");

  console.log(`Both results match: ${perfResultA === perfResultB ? "✅" : "❌"}`);
  console.log(`Result: ${perfResultA.toLocaleString()}\n`);

  // Edge case testing
  console.log("=== Edge Case Tests ===");

  // Test with very large number (approaching Number.MAX_SAFE_INTEGER)
  const largeN = Math.floor(Math.sqrt(Number.MAX_SAFE_INTEGER * 2)) - 1;
  console.log(`Testing with large n = ${largeN} (max safe calculation)`);

  const largeResultA = sum_to_n_a(largeN);
  const largeResultB = sum_to_n_b(largeN);

  console.log(`Large number test - Results match: ${largeResultA === largeResultB ? "✅" : "❌"}`);
  console.log(`Result: ${largeResultA.toLocaleString()}\n`);

  // Summary
  console.log("=== Test Summary ===");
  console.log(`Tests passed: ${passedTests}/${totalTests}`);
  console.log(`Success rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

  if (passedTests === totalTests) {
    console.log("🎉 All tests passed!");
  } else {
    console.log("⚠️  Some tests failed. Please review the implementations.");
  }
}

/**
 * Verification function to demonstrate mathematical correctness
 */
function verifyMathematicalFormula(): void {
  console.log("\n=== Mathematical Formula Verification ===");
  console.log("The formula n * (n + 1) / 2 is derived from the arithmetic series sum:");
  console.log("Sum = 1 + 2 + 3 + ... + n");
  console.log("This can be written as: Sum = n * (first + last) / 2");
  console.log("Where first = 1, last = n");
  console.log("Therefore: Sum = n * (1 + n) / 2 = n * (n + 1) / 2");
  console.log();

  // Demonstrate with a few examples
  [3, 5, 10].forEach((n) => {
    const manual = Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a + b, 0);
    const formula = (n * (n + 1)) / 2;
    console.log(`n=${n}: Manual sum = ${manual}, Formula = ${formula}, Match = ${manual === formula ? "✅" : "❌"}`);
  });
}

// Run all tests
runTests();
verifyMathematicalFormula();
