import { describe, it, expect } from "vitest";

/**
 * Password Strength Checker - Unit Tests
 *
 * These tests verify the cybersecurity logic used in the Password Checker component.
 * They ensure that password analysis algorithms work correctly for educational purposes.
 */

/**
 * Calculate Password Entropy
 * This function is extracted from PasswordChecker component for testing
 */
function calculateEntropy(pwd: string): number {
  if (!pwd) return 0;

  let charsetSize = 0;

  if (/[a-z]/.test(pwd)) charsetSize += 26;
  if (/[A-Z]/.test(pwd)) charsetSize += 26;
  if (/\d/.test(pwd)) charsetSize += 10;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) charsetSize += 32;

  const entropy = pwd.length * Math.log2(charsetSize);

  return entropy;
}

/**
 * Estimate Time to Crack Password
 * This function is extracted from PasswordChecker component for testing
 */
function estimateCrackTime(entropy: number): string {
  const guessesPerSecond = 1e9;
  const totalAttempts = Math.pow(2, entropy) / 2;
  const seconds = totalAttempts / guessesPerSecond;

  if (seconds < 1) return "Less than 1 second";
  if (seconds < 60) return `${Math.round(seconds)} seconds`;

  const minutes = seconds / 60;
  if (minutes < 60) return `${Math.round(minutes)} minutes`;

  const hours = minutes / 60;
  if (hours < 24) return `${Math.round(hours)} hours`;

  const days = hours / 24;
  if (days < 365) return `${Math.round(days)} days`;

  const years = days / 365;
  if (years < 1e6) return `${Math.round(years)} years`;

  return "Longer than human civilization";
}

describe("Password Strength Checker - Entropy Calculation", () => {
  it("should return 0 entropy for empty password", () => {
    const entropy = calculateEntropy("");
    expect(entropy).toBe(0);
  });

  it("should calculate entropy for lowercase only password", () => {
    // "abc" = 3 chars * log2(26) ≈ 3 * 4.7 ≈ 14.1
    const entropy = calculateEntropy("abc");
    expect(entropy).toBeGreaterThan(14);
    expect(entropy).toBeLessThan(15);
  });

  it("should calculate entropy for mixed case password", () => {
    // "Abc" = 3 chars * log2(52) ≈ 3 * 5.7 ≈ 17.1
    const entropy = calculateEntropy("Abc");
    expect(entropy).toBeGreaterThan(17);
    expect(entropy).toBeLessThan(18);
  });

  it("should calculate entropy for password with numbers", () => {
    // "Abc1" = 4 chars * log2(62) ≈ 4 * 5.95 ≈ 23.8
    const entropy = calculateEntropy("Abc1");
    expect(entropy).toBeGreaterThan(23);
    expect(entropy).toBeLessThan(24);
  });

  it("should calculate entropy for password with special characters", () => {
    // "Abc1!" = 5 chars * log2(94) ≈ 5 * 6.55 ≈ 32.75
    const entropy = calculateEntropy("Abc1!");
    expect(entropy).toBeGreaterThan(32);
    expect(entropy).toBeLessThan(33);
  });

  it("should have higher entropy for longer passwords", () => {
    const short = calculateEntropy("Abc1!");
    const long = calculateEntropy("Abc1!Xyz9@");
    expect(long).toBeGreaterThan(short);
  });

  it("should calculate entropy for realistic strong password", () => {
    // "Kx9#mP2@Lq" - 10 chars with all character types
    const entropy = calculateEntropy("Kx9#mP2@Lq");
    expect(entropy).toBeGreaterThan(65);
  });
});

describe("Password Strength Checker - Crack Time Estimation", () => {
  it("should return 'Less than 1 second' for very weak entropy", () => {
    const time = estimateCrackTime(5);
    expect(time).toBe("Less than 1 second");
  });

  it("should return seconds for low entropy", () => {
    // entropy ~20 bits = ~1 million combinations
    const time = estimateCrackTime(20);
    expect(time).toContain("second");
  });

  it("should return minutes for moderate entropy", () => {
    // entropy ~30 bits = ~1 billion combinations
    const time = estimateCrackTime(30);
    expect(time).toContain("minute");
  });

  it("should return hours for good entropy", () => {
    // entropy ~40 bits
    const time = estimateCrackTime(40);
    expect(time).toContain("hour");
  });

  it("should return days for strong entropy", () => {
    // entropy ~50 bits
    const time = estimateCrackTime(50);
    expect(time).toContain("day");
  });

  it("should return years for very strong entropy", () => {
    // entropy ~65 bits (realistic strong password)
    const time = estimateCrackTime(65);
    expect(time).toContain("year");
  });

  it("should return 'Longer than human civilization' for extremely high entropy", () => {
    const time = estimateCrackTime(200);
    expect(time).toBe("Longer than human civilization");
  });
});

describe("Password Strength Checker - Real-World Scenarios", () => {
  it("should identify weak password 'password123'", () => {
    const entropy = calculateEntropy("password123");
    // Contains lowercase, uppercase (implicit from dictionary), and numbers
    // But it's a common pattern, so entropy should be moderate
    expect(entropy).toBeGreaterThan(40);
    expect(entropy).toBeLessThan(50);
  });

  it("should identify strong password 'Kx9#mP2@Lq'", () => {
    const entropy = calculateEntropy("Kx9#mP2@Lq");
    const time = estimateCrackTime(entropy);
    // Should take significant time to crack
    expect(time).toContain("year");
  });

  it("should show difference between 'abc' and 'abcdefghij'", () => {
    const short = calculateEntropy("abc");
    const long = calculateEntropy("abcdefghij");
    // Longer password should have significantly higher entropy
    expect(long).toBeGreaterThan(short * 2);
  });

  it("should show importance of character diversity", () => {
    const lowercase = calculateEntropy("abcdefghij");
    const mixed = calculateEntropy("AbCdEfGhIj");
    // Mixed case should have higher entropy
    expect(mixed).toBeGreaterThan(lowercase);
  });
});

describe("Password Strength Checker - Edge Cases", () => {
  it("should handle single character password", () => {
    const entropy = calculateEntropy("a");
    expect(entropy).toBeGreaterThan(0);
    expect(entropy).toBeLessThan(5);
  });

  it("should handle very long password", () => {
    const longPassword = "Kx9#mP2@Lq".repeat(10);
    const entropy = calculateEntropy(longPassword);
    expect(entropy).toBeGreaterThan(650);
  });

  it("should handle password with only numbers", () => {
    const entropy = calculateEntropy("123456789");
    // 9 chars * log2(10) ≈ 9 * 3.32 ≈ 29.9
    expect(entropy).toBeGreaterThan(29);
    expect(entropy).toBeLessThan(31);
  });

  it("should handle password with only special characters", () => {
    const entropy = calculateEntropy("!@#$%^&*");
    // 8 chars * log2(32) ≈ 8 * 5 = 40
    expect(entropy).toBeGreaterThan(39);
    expect(entropy).toBeLessThan(41);
  });
});
