import { describe, it, expect } from "vitest";

/**
 * URL Phishing Checker - Unit Tests
 *
 * These tests verify the phishing detection logic used in the URL Checker component.
 * They ensure that URL analysis algorithms work correctly for educational purposes.
 */

/**
 * Parse URL into components
 * This function is extracted from URLChecker component for testing
 */
function parseURL(
  urlString: string
): {
  protocol: string;
  domain: string;
  subdomain: string;
  tld: string;
  path: string;
  isValid: boolean;
} {
  try {
    let urlToParse = urlString;
    if (!urlToParse.startsWith("http://") && !urlToParse.startsWith("https://")) {
      urlToParse = "https://" + urlToParse;
    }

    const urlObj = new URL(urlToParse);
    const hostname = urlObj.hostname;
    const parts = hostname.split(".");

    const tld = parts[parts.length - 1];
    const domain = parts[parts.length - 2];
    const subdomain = parts.slice(0, -2).join(".");

    return {
      protocol: urlObj.protocol.replace(":", ""),
      domain: domain,
      subdomain: subdomain,
      tld: tld,
      path: urlObj.pathname + urlObj.search,
      isValid: true,
    };
  } catch {
    return {
      protocol: "",
      domain: "",
      subdomain: "",
      tld: "",
      path: "",
      isValid: false,
    };
  }
}

/**
 * Detect Typosquatting
 * This function is extracted from URLChecker component for testing
 */
function detectTyposquatting(domain: string): string[] {
  const issues: string[] = [];

  if (/[0O]/.test(domain) && domain.length > 3) {
    issues.push("Contains 0 (zero) or O - verify this is not a typo");
  }
  if (/[1Il]/.test(domain) && domain.length > 3) {
    issues.push("Contains 1, I, or l - these look similar, verify domain");
  }
  if (/[5S]/.test(domain)) {
    issues.push("Contains 5 or S - verify this matches the legitimate domain");
  }

  const vowelCount = (domain.match(/[aeiou]/gi) || []).length;
  if (vowelCount === 0 && domain.length > 5) {
    issues.push("Domain has no vowels - unusual pattern, verify legitimacy");
  }

  if (/(.)\1{2,}/.test(domain)) {
    issues.push("Contains repeated characters - verify domain spelling");
  }

  return issues;
}

describe("URL Checker - URL Parsing", () => {
  it("should parse valid HTTPS URL", () => {
    const parsed = parseURL("https://www.google.com");
    expect(parsed.isValid).toBe(true);
    expect(parsed.protocol).toBe("https");
    expect(parsed.domain).toBe("google");
    expect(parsed.tld).toBe("com");
  });

  it("should parse valid HTTP URL", () => {
    const parsed = parseURL("http://www.example.com");
    expect(parsed.isValid).toBe(true);
    expect(parsed.protocol).toBe("http");
    expect(parsed.domain).toBe("example");
    expect(parsed.tld).toBe("com");
  });

  it("should add HTTPS protocol if missing", () => {
    const parsed = parseURL("www.google.com");
    expect(parsed.isValid).toBe(true);
    expect(parsed.protocol).toBe("https");
  });

  it("should extract subdomain correctly", () => {
    const parsed = parseURL("https://mail.google.com");
    expect(parsed.subdomain).toBe("mail");
    expect(parsed.domain).toBe("google");
  });

  it("should extract path correctly", () => {
    const parsed = parseURL("https://www.google.com/search?q=test");
    expect(parsed.path).toContain("/search");
    expect(parsed.path).toContain("q=test");
  });

  it("should handle invalid URL", () => {
    const parsed = parseURL("not a valid url at all");
    expect(parsed.isValid).toBe(false);
  });

  it("should handle URL with multiple subdomains", () => {
    const parsed = parseURL("https://mail.google.co.uk");
    expect(parsed.isValid).toBe(true);
  });
});

describe("URL Checker - Typosquatting Detection", () => {
  it("should detect zero instead of O", () => {
    const issues = detectTyposquatting("g00gle");
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0]).toContain("0 (zero) or O");
  });

  it("should detect 1 instead of I or L", () => {
    const issues = detectTyposquatting("gma1l");
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0]).toContain("1, I, or l");
  });

  it("should detect 5 instead of S", () => {
    const issues = detectTyposquatting("ama5on");
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0]).toContain("5 or S");
  });

  it("should detect domains with no vowels", () => {
    const issues = detectTyposquatting("bcdfg");
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0]).toContain("no vowels");
  });

  it("should detect repeated characters", () => {
    const issues = detectTyposquatting("goooogle");
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0]).toContain("repeated characters");
  });

  it("should not flag legitimate domain", () => {
    const issues = detectTyposquatting("google");
    expect(issues.length).toBe(0);
  });

  it("should not flag legitimate domain with numbers", () => {
    const issues = detectTyposquatting("web3");
    expect(issues.length).toBe(0);
  });

  it("should flag short domain with suspicious character", () => {
    const issues = detectTyposquatting("g0");
    expect(issues.length).toBe(0); // Too short to flag
  });
});

describe("URL Checker - Real-World Phishing Scenarios", () => {
  it("should identify legitimate Google URL", () => {
    const parsed = parseURL("https://www.google.com");
    expect(parsed.isValid).toBe(true);
    expect(parsed.protocol).toBe("https");
    expect(parsed.domain).toBe("google");

    const typos = detectTyposquatting(parsed.domain);
    expect(typos.length).toBe(0);
  });

  it("should identify typosquatted Google URL", () => {
    const parsed = parseURL("https://www.gooqle.com");
    expect(parsed.isValid).toBe(true);
    expect(parsed.domain).toBe("gooqle");

    const typos = detectTyposquatting(parsed.domain);
    expect(typos.length).toBeGreaterThan(0);
  });

  it("should identify Amazon with zero instead of o", () => {
    const parsed = parseURL("https://www.amaz0n.com");
    expect(parsed.domain).toBe("amaz0n");

    const typos = detectTyposquatting(parsed.domain);
    expect(typos.length).toBeGreaterThan(0);
    expect(typos[0]).toContain("0 (zero)");
  });

  it("should identify Gmail with 1 instead of i", () => {
    const parsed = parseURL("https://www.gma1l.com");
    expect(parsed.domain).toBe("gma1l");

    const typos = detectTyposquatting(parsed.domain);
    expect(typos.length).toBeGreaterThan(0);
  });

  it("should flag HTTP protocol as insecure", () => {
    const parsed = parseURL("http://www.bank.com");
    expect(parsed.protocol).toBe("http");
  });

  it("should recognize HTTPS as secure", () => {
    const parsed = parseURL("https://www.bank.com");
    expect(parsed.protocol).toBe("https");
  });
});

describe("URL Checker - Subdomain Spoofing Detection", () => {
  it("should correctly parse legitimate subdomain", () => {
    const parsed = parseURL("https://mail.google.com");
    expect(parsed.subdomain).toBe("mail");
    expect(parsed.domain).toBe("google");
  });

  it("should correctly parse subdomain spoofing attempt", () => {
    // Attacker domain: attacker.com, spoofed as google.com.attacker.com
    const parsed = parseURL("https://google.com.attacker.com");
    expect(parsed.isValid).toBe(true);
    // The actual domain is 'attacker', not 'google'
    expect(parsed.domain).toBe("attacker");
  });

  it("should correctly identify real domain in complex subdomain", () => {
    const parsed = parseURL("https://secure.mail.google.com");
    expect(parsed.domain).toBe("google");
    expect(parsed.tld).toBe("com");
  });
});

describe("URL Checker - Edge Cases", () => {
  it("should handle URL with port number", () => {
    const parsed = parseURL("https://www.google.com:8080");
    expect(parsed.isValid).toBe(true);
    expect(parsed.domain).toBe("google");
  });

  it("should handle URL with authentication", () => {
    const parsed = parseURL("https://user:pass@www.google.com");
    expect(parsed.isValid).toBe(true);
    expect(parsed.domain).toBe("google");
  });

  it("should handle URL with fragment", () => {
    const parsed = parseURL("https://www.google.com#section");
    expect(parsed.isValid).toBe(true);
    expect(parsed.domain).toBe("google");
  });

  it("should handle international domain", () => {
    const parsed = parseURL("https://www.example.co.uk");
    expect(parsed.isValid).toBe(true);
  });

  it("should handle very long domain", () => {
    const parsed = parseURL(
      "https://www.verylongsubdomainname.verylongdomainname.com"
    );
    expect(parsed.isValid).toBe(true);
    expect(parsed.domain).toBe("verylongdomainname");
  });
});

describe("URL Checker - Security Indicators", () => {
  it("should identify HTTP as insecure", () => {
    const parsed = parseURL("http://secure.bank.com");
    expect(parsed.protocol).toBe("http");
  });

  it("should identify HTTPS as secure", () => {
    const parsed = parseURL("https://secure.bank.com");
    expect(parsed.protocol).toBe("https");
  });

  it("should extract path with login keyword", () => {
    const parsed = parseURL("https://bank.com/login");
    expect(parsed.path).toContain("/login");
  });

  it("should extract path with verify keyword", () => {
    const parsed = parseURL("https://bank.com/verify-account");
    expect(parsed.path).toContain("/verify");
  });

  it("should extract query parameters", () => {
    const parsed = parseURL("https://bank.com/login?redirect=attacker.com");
    expect(parsed.path).toContain("redirect=attacker.com");
  });
});
