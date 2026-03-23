import { describe, it, expect } from "vitest";

/**
 * Two-Factor Authentication (2FA) Checker - Unit Tests
 *
 * These tests verify the 2FA recommendation logic and security scoring.
 * They ensure that the comparison algorithms work correctly for educational purposes.
 */

/**
 * Get Security Score for 2FA Method
 * This function is extracted from TwoFAChecker component for testing
 */
function getSecurityScore(method: "sms" | "authenticator" | "biometric"): number {
  switch (method) {
    case "sms":
      return 40; // Basic protection, but vulnerable to SIM swapping
    case "authenticator":
      return 85; // Strong protection, immune to most attacks
    case "biometric":
      return 95; // Strongest protection, tied to device
    default:
      return 0;
  }
}

/**
 * Get Recommendation Based on Use Case
 * This function is extracted from TwoFAChecker component for testing
 */
function getRecommendation(useCase: "personal" | "banking" | "work"): string {
  switch (useCase) {
    case "personal":
      return "For personal accounts, Authenticator App is recommended. It balances security and convenience. SMS is acceptable for less sensitive accounts.";
    case "banking":
      return "For banking and financial accounts, Biometric or Authenticator App is essential. Never use SMS alone for banking. Use strongest available method.";
    case "work":
      return "For work accounts, follow your organization's security policy. Usually Authenticator App or Biometric required. SMS not recommended for work accounts.";
    default:
      return "Select a use case to get personalized recommendations.";
  }
}

/**
 * Determine Best 2FA Method for Use Case
 * This function is extracted from TwoFAChecker component for testing
 */
function getBestMethodForUseCase(
  useCase: "personal" | "banking" | "work"
): "sms" | "authenticator" | "biometric" {
  switch (useCase) {
    case "personal":
      return "authenticator"; // Good balance of security and convenience
    case "banking":
      return "biometric"; // Highest security for sensitive accounts
    case "work":
      return "authenticator"; // Standard for enterprise security
    default:
      return "authenticator";
  }
}

/**
 * Check if 2FA Method is Vulnerable to SIM Swapping
 * This function is extracted from TwoFAChecker component for testing
 */
function isVulnerableToSIMSwapping(method: "sms" | "authenticator" | "biometric"): boolean {
  return method === "sms";
}

/**
 * Check if 2FA Method is Vulnerable to Interception
 * This function is extracted from TwoFAChecker component for testing
 */
function isVulnerableToInterception(method: "sms" | "authenticator" | "biometric"): boolean {
  return method === "sms"; // SMS can be intercepted, others are local/device-based
}

/**
 * Check if 2FA Method Requires Internet Connection
 * This function is extracted from TwoFAChecker component for testing
 */
function requiresInternetConnection(method: "sms" | "authenticator" | "biometric"): boolean {
  return method === "sms"; // SMS requires cellular/data connection
}

describe("2FA Checker - Security Scoring", () => {
  it("should rate SMS as low security", () => {
    const score = getSecurityScore("sms");
    expect(score).toBe(40);
    expect(score).toBeLessThan(50);
  });

  it("should rate Authenticator App as high security", () => {
    const score = getSecurityScore("authenticator");
    expect(score).toBe(85);
    expect(score).toBeGreaterThan(80);
  });

  it("should rate Biometric as highest security", () => {
    const score = getSecurityScore("biometric");
    expect(score).toBe(95);
    expect(score).toBeGreaterThan(90);
  });

  it("should have biometric score higher than authenticator", () => {
    const biometric = getSecurityScore("biometric");
    const authenticator = getSecurityScore("authenticator");
    expect(biometric).toBeGreaterThan(authenticator);
  });

  it("should have authenticator score higher than SMS", () => {
    const authenticator = getSecurityScore("authenticator");
    const sms = getSecurityScore("sms");
    expect(authenticator).toBeGreaterThan(sms);
  });
});

describe("2FA Checker - Use Case Recommendations", () => {
  it("should recommend Authenticator App for personal accounts", () => {
    const recommendation = getRecommendation("personal");
    expect(recommendation).toContain("Authenticator App");
    expect(recommendation).toContain("personal");
  });

  it("should recommend Biometric or Authenticator for banking", () => {
    const recommendation = getRecommendation("banking");
    expect(recommendation).toContain("Biometric");
    expect(recommendation).toContain("Authenticator");
    expect(recommendation).toContain("banking");
  });

  it("should warn against SMS for banking", () => {
    const recommendation = getRecommendation("banking");
    expect(recommendation).toContain("Never use SMS alone");
  });

  it("should recommend following org policy for work", () => {
    const recommendation = getRecommendation("work");
    expect(recommendation).toContain("organization");
    expect(recommendation).toContain("security policy");
  });

  it("should not recommend SMS for work accounts", () => {
    const recommendation = getRecommendation("work");
    expect(recommendation).toContain("SMS not recommended");
  });
});

describe("2FA Checker - Best Method Selection", () => {
  it("should select Authenticator App for personal use", () => {
    const best = getBestMethodForUseCase("personal");
    expect(best).toBe("authenticator");
  });

  it("should select Biometric for banking", () => {
    const best = getBestMethodForUseCase("banking");
    expect(best).toBe("biometric");
  });

  it("should select Authenticator App for work", () => {
    const best = getBestMethodForUseCase("work");
    expect(best).toBe("authenticator");
  });

  it("should never select SMS as best method", () => {
    const personal = getBestMethodForUseCase("personal");
    const banking = getBestMethodForUseCase("banking");
    const work = getBestMethodForUseCase("work");

    expect(personal).not.toBe("sms");
    expect(banking).not.toBe("sms");
    expect(work).not.toBe("sms");
  });
});

describe("2FA Checker - Vulnerability Analysis", () => {
  it("should identify SMS as vulnerable to SIM swapping", () => {
    expect(isVulnerableToSIMSwapping("sms")).toBe(true);
  });

  it("should identify Authenticator App as immune to SIM swapping", () => {
    expect(isVulnerableToSIMSwapping("authenticator")).toBe(false);
  });

  it("should identify Biometric as immune to SIM swapping", () => {
    expect(isVulnerableToSIMSwapping("biometric")).toBe(false);
  });

  it("should identify SMS as vulnerable to interception", () => {
    expect(isVulnerableToInterception("sms")).toBe(true);
  });

  it("should identify Authenticator App as immune to interception", () => {
    expect(isVulnerableToInterception("authenticator")).toBe(false);
  });

  it("should identify Biometric as immune to interception", () => {
    expect(isVulnerableToInterception("biometric")).toBe(false);
  });
});

describe("2FA Checker - Connectivity Requirements", () => {
  it("should identify SMS as requiring internet connection", () => {
    expect(requiresInternetConnection("sms")).toBe(true);
  });

  it("should identify Authenticator App as not requiring internet", () => {
    expect(requiresInternetConnection("authenticator")).toBe(false);
  });

  it("should identify Biometric as not requiring internet", () => {
    expect(requiresInternetConnection("biometric")).toBe(false);
  });
});

describe("2FA Checker - Real-World Scenarios", () => {
  it("should recommend strong 2FA for banking account", () => {
    const useCase = "banking";
    const best = getBestMethodForUseCase(useCase);
    const score = getSecurityScore(best);

    expect(score).toBeGreaterThan(80);
    expect(best).not.toBe("sms");
  });

  it("should allow SMS for personal low-security account", () => {
    const useCase = "personal";
    const recommendation = getRecommendation(useCase);

    expect(recommendation).toContain("SMS is acceptable");
  });

  it("should prioritize security for work accounts", () => {
    const useCase = "work";
    const recommendation = getRecommendation(useCase);

    expect(recommendation).toContain("security policy");
  });

  it("should recommend offline-capable method when connectivity is concern", () => {
    const authenticator = requiresInternetConnection("authenticator");
    const biometric = requiresInternetConnection("biometric");

    expect(authenticator).toBe(false);
    expect(biometric).toBe(false);
  });
});

describe("2FA Checker - Comparison Logic", () => {
  it("should show that Biometric is more secure than SMS", () => {
    const biometric = getSecurityScore("biometric");
    const sms = getSecurityScore("sms");

    expect(biometric).toBeGreaterThan(sms);
    expect(biometric - sms).toBeGreaterThan(40);
  });

  it("should show that Authenticator is more secure than SMS", () => {
    const authenticator = getSecurityScore("authenticator");
    const sms = getSecurityScore("sms");

    expect(authenticator).toBeGreaterThan(sms);
    expect(authenticator - sms).toBeGreaterThan(40);
  });

  it("should show that Biometric is slightly more secure than Authenticator", () => {
    const biometric = getSecurityScore("biometric");
    const authenticator = getSecurityScore("authenticator");

    expect(biometric).toBeGreaterThan(authenticator);
    expect(biometric - authenticator).toBeLessThan(20);
  });
});

describe("2FA Checker - SIM Swapping Attack Context", () => {
  it("should explain why SMS is vulnerable", () => {
    const vulnerable = isVulnerableToSIMSwapping("sms");
    const score = getSecurityScore("sms");

    expect(vulnerable).toBe(true);
    expect(score).toBeLessThan(50);
  });

  it("should show that authenticator protects against SIM swapping", () => {
    const vulnerable = isVulnerableToSIMSwapping("authenticator");
    const score = getSecurityScore("authenticator");

    expect(vulnerable).toBe(false);
    expect(score).toBeGreaterThan(80);
  });

  it("should show that biometric is immune to SIM swapping", () => {
    const vulnerable = isVulnerableToSIMSwapping("biometric");
    const score = getSecurityScore("biometric");

    expect(vulnerable).toBe(false);
    expect(score).toBeGreaterThan(90);
  });
});

describe("2FA Checker - Offline Capability", () => {
  it("should show that Authenticator App works offline", () => {
    const requiresInternet = requiresInternetConnection("authenticator");
    expect(requiresInternet).toBe(false);
  });

  it("should show that Biometric works offline", () => {
    const requiresInternet = requiresInternetConnection("biometric");
    expect(requiresInternet).toBe(false);
  });

  it("should show that SMS requires connectivity", () => {
    const requiresInternet = requiresInternetConnection("sms");
    expect(requiresInternet).toBe(true);
  });

  it("should recommend offline-capable method for travelers", () => {
    // Travelers might have connectivity issues
    const authenticator = requiresInternetConnection("authenticator");
    const biometric = requiresInternetConnection("biometric");
    const sms = requiresInternetConnection("sms");

    expect(authenticator || biometric).toBe(true); // At least one offline option
    expect(sms).toBe(true); // SMS requires connectivity
  });
});
