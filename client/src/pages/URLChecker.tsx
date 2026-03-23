import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Copy, Check } from "lucide-react";
import AnimatedCard from "@/components/AnimatedCard";
import DoodleShape from "@/components/DoodleShape";
import InfoTooltip from "@/components/InfoTooltip";

/**
 * URL Phishing Checker Page
 *
 * This page teaches users to identify suspicious URLs using pattern recognition
 * and common phishing tactics.
 *
 * Educational Objectives:
 * 1. Teach URL structure and how to read domain names
 * 2. Identify common phishing tactics (typosquatting, fake domains, etc.)
 * 3. Recognize security indicators (HTTPS, domain verification)
 * 4. Understand real-world phishing examples
 *
 * Cybersecurity Concepts Explained:
 *
 * URL STRUCTURE:
 * https://subdomain.example.com:443/path?query=value#fragment
 * |      |         |       |    |    |    |      |        |
 * Protocol Domain  Subdomain TLD Port Path Query String Fragment
 *
 * PHISHING TACTICS:
 *
 * 1. TYPOSQUATTING
 *    - Legitimate: https://www.google.com
 *    - Phishing: https://www.gooqle.com (q instead of o)
 *    - Phishing: https://www.g00gle.com (0 instead of o)
 *    - Phishing: https://www.gogle.com (missing o)
 *    - Defense: Bookmark legitimate sites, type carefully, check domain carefully
 *
 * 2. SUBDOMAIN SPOOFING
 *    - Legitimate: https://mail.google.com
 *    - Phishing: https://google.com.attacker.com (attacker.com is the real domain)
 *    - Defense: Check the domain AFTER the last dot, not subdomains
 *
 * 3. PROTOCOL SPOOFING
 *    - Legitimate: https://secure.bank.com (encrypted connection)
 *    - Phishing: http://secure.bank.com (no encryption, data sent in plain text)
 *    - Defense: Always use HTTPS for sensitive sites, check for padlock icon
 *
 * 4. FAKE DOMAINS
 *    - Legitimate: https://www.amazon.com
 *    - Phishing: https://www.amaz0n.com (0 instead of o)
 *    - Phishing: https://www.amazn.com (missing o)
 *    - Defense: Know the exact domain, use bookmarks
 *
 * 5. SUSPICIOUS PATHS & PARAMETERS
 *    - Phishing: https://bank.com/login.php?redirect=attacker.com
 *    - Phishing: https://bank.com/secure/verify-account?token=...
 *    - Defense: Check URL before entering credentials
 *
 * REAL-WORLD CONTEXT:
 * - Phishing emails are the #1 entry point for ransomware (90% of breaches)
 * - Users are more vulnerable than technical security measures
 * - Attackers use urgency ("Verify now!") and authority ("From IT Department")
 * - This tool teaches pattern recognition, not a replacement for security tools
 */

interface URLAnalysis {
  riskLevel: "safe" | "suspicious" | "dangerous";
  score: number;
  issues: string[];
  warnings: string[];
  positives: string[];
  details: {
    protocol: string;
    domain: string;
    subdomain: string;
    tld: string;
    path: string;
  };
}

export default function URLChecker() {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  /**
   * Parse URL into components
   *
   * This function extracts the main parts of a URL for analysis.
   * It handles various URL formats and edge cases.
   */
  const parseURL = (
    urlString: string
  ): {
    protocol: string;
    domain: string;
    subdomain: string;
    tld: string;
    path: string;
    isValid: boolean;
  } => {
    try {
      // Add protocol if missing (for parsing purposes)
      let urlToParse = urlString;
      if (!urlToParse.startsWith("http://") && !urlToParse.startsWith("https://")) {
        urlToParse = "https://" + urlToParse;
      }

      const urlObj = new URL(urlToParse);
      const hostname = urlObj.hostname;
      const parts = hostname.split(".");

      // Extract TLD (last part)
      const tld = parts[parts.length - 1];

      // Extract domain (second to last part)
      const domain = parts[parts.length - 2];

      // Extract subdomain (everything before domain.tld)
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
  };

  /**
   * Detect Typosquatting
   *
   * Typosquatting is when attackers register domains similar to legitimate ones
   * by making small changes (letter substitution, omission, transposition).
   *
   * Common techniques:
   * - Character substitution: 0 (zero) for O, 1 (one) for I/L, 5 for S
   * - Character omission: "amzon" instead of "amazon"
   * - Character transposition: "gmial" instead of "gmail"
   * - Homograph attacks: Using similar-looking Unicode characters
   *
   * This function checks for these patterns in the domain.
   */
  const detectTyposquatting = (domain: string): string[] => {
    const issues: string[] = [];

    // Check for common character substitutions
    if (/[0O]/.test(domain) && domain.length > 3) {
      issues.push("Contains 0 (zero) or O - verify this is not a typo");
    }
    if (/[1Il]/.test(domain) && domain.length > 3) {
      issues.push("Contains 1, I, or l - these look similar, verify domain");
    }
    if (/[5S]/.test(domain)) {
      issues.push("Contains 5 or S - verify this matches the legitimate domain");
    }

    // Check for missing vowels (common omission attack)
    const vowelCount = (domain.match(/[aeiou]/gi) || []).length;
    if (vowelCount === 0 && domain.length > 5) {
      issues.push("Domain has no vowels - unusual pattern, verify legitimacy");
    }

    // Check for double letters (often used in typosquatting)
    if (/(.)\1{2,}/.test(domain)) {
      issues.push("Contains repeated characters - verify domain spelling");
    }

    return issues;
  };

  /**
   * Analyze URL for Phishing Indicators
   *
   * This function checks for common phishing patterns and suspicious characteristics.
   */
  const analyzeURL = (urlString: string): URLAnalysis => {
    const issues: string[] = [];
    const warnings: string[] = [];
    const positives: string[] = [];
    let score = 0;

    if (!urlString) {
      return {
        riskLevel: "safe",
        score: 0,
        issues: ["Enter a URL to analyze"],
        warnings: [],
        positives: [],
        details: {
          protocol: "",
          domain: "",
          subdomain: "",
          tld: "",
          path: "",
        },
      };
    }

    const parsed = parseURL(urlString);

    if (!parsed.isValid) {
      return {
        riskLevel: "dangerous",
        score: 100,
        issues: ["Invalid URL format - cannot parse"],
        warnings: [],
        positives: [],
        details: parsed,
      };
    }

    // Protocol check
    if (parsed.protocol === "http") {
      issues.push("Uses HTTP instead of HTTPS - connection is NOT encrypted");
      warnings.push("Never enter passwords or sensitive data on HTTP sites");
      score += 30;
    } else if (parsed.protocol === "https") {
      positives.push("Uses HTTPS - connection is encrypted");
      score -= 20;
    }

    // Domain analysis
    const domainIssues = detectTyposquatting(parsed.domain);
    issues.push(...domainIssues);
    score += domainIssues.length * 15;

    // Check for suspicious subdomains
    if (parsed.subdomain) {
      // Check if subdomain contains the main domain name (subdomain spoofing)
      if (parsed.subdomain.includes(parsed.domain)) {
        positives.push("Subdomain structure looks normal");
      } else {
        // Check for suspicious patterns in subdomain
        if (parsed.subdomain.length > 20) {
          warnings.push("Subdomain is unusually long - may be suspicious");
          score += 10;
        }
        if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(parsed.subdomain)) {
          issues.push("Subdomain contains IP address - highly suspicious");
          score += 40;
        }
      }
    }

    // TLD check
    const commonTLDs = ["com", "org", "net", "edu", "gov", "co", "uk", "de", "fr"];
    if (commonTLDs.includes(parsed.tld)) {
      positives.push("Uses common TLD (.${parsed.tld})");
    } else if (parsed.tld.length > 4) {
      warnings.push("Unusual TLD - verify this is legitimate");
      score += 15;
    }

    // Path analysis
    if (parsed.path.includes("login") || parsed.path.includes("verify")) {
      warnings.push("URL contains login/verify path - check if this is expected");
      score += 10;
    }

    // Check for suspicious patterns in path
    if (parsed.path.includes("redirect") || parsed.path.includes("return")) {
      issues.push("URL contains redirect parameter - may be phishing");
      score += 25;
    }

    // Check for data exfiltration patterns
    if (parsed.path.includes("token") || parsed.path.includes("session")) {
      warnings.push("URL contains token/session parameter - verify context");
      score += 10;
    }

    // Determine risk level
    let riskLevel: "safe" | "suspicious" | "dangerous";
    if (score < 20) riskLevel = "safe";
    else if (score < 50) riskLevel = "suspicious";
    else riskLevel = "dangerous";

    return {
      riskLevel,
      score: Math.min(score, 100),
      issues,
      warnings,
      positives,
      details: parsed,
    };
  };

  const analysis = useMemo(() => analyzeURL(url), [url]);

  const riskColors = {
    safe: "text-chart-4",
    suspicious: "text-chart-2",
    dangerous: "text-destructive",
  };

  const riskBgColors = {
    safe: "bg-chart-4/20",
    suspicious: "bg-chart-2/20",
    dangerous: "bg-destructive/20",
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background py-12 sm:py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            URL Phishing Checker
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Analyze URLs for phishing indicators, typosquatting, and suspicious patterns. Learn to
            identify dangerous links before clicking.
          </p>
        </motion.div>

        {/* Decorative Shapes */}
        <div className="absolute top-20 left-10 pointer-events-none">
          <DoodleShape type="square" color="bg-chart-1" size="lg" opacity={0.1} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <AnimatedCard variant="default">
              <h2 className="text-xl font-bold text-foreground mb-4">Enter URL</h2>

              {/* URL Input */}
              <div className="relative mb-4">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="doodle-input"
                />
              </div>

              {/* Copy Button */}
              {url && (
                <motion.button
                  onClick={copyToClipboard}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 text-foreground hover:bg-secondary/70 transition-colors mb-6"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Copy URL
                    </>
                  )}
                </motion.button>
              )}

              {/* Info Box */}
              <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                <p className="font-semibold mb-2">⚠️ Before Clicking:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Hover over links to see actual URL</li>
                  <li>• Check domain carefully (not subdomains)</li>
                  <li>• Verify HTTPS and padlock icon</li>
                  <li>• Never click urgent "verify now" links</li>
                </ul>
              </div>
            </AnimatedCard>
          </motion.div>

          {/* Analysis Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            {url ? (
              <div className="space-y-6">
                {/* Risk Assessment */}
                <AnimatedCard variant="default">
                  <h3 className="text-lg font-bold text-foreground mb-4">Risk Assessment</h3>

                  {/* Risk Level */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-foreground">Risk Level</span>
                      <motion.span
                        key={analysis.riskLevel}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`text-lg font-bold px-4 py-1 rounded-full ${riskBgColors[analysis.riskLevel]} ${riskColors[analysis.riskLevel]} flex items-center gap-2`}
                      >
                        {analysis.riskLevel === "safe" && <CheckCircle className="w-5 h-5" />}
                        {analysis.riskLevel === "suspicious" && (
                          <AlertTriangle className="w-5 h-5" />
                        )}
                        {analysis.riskLevel === "dangerous" && (
                          <AlertTriangle className="w-5 h-5" />
                        )}
                        {analysis.riskLevel.toUpperCase()}
                      </motion.span>
                    </div>

                    {/* Risk Meter */}
                    <div className="w-full h-3 bg-border rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${analysis.score}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`h-full rounded-full ${ analysis.riskLevel === "safe"
                          ? "bg-chart-4"
                          : analysis.riskLevel === "suspicious"
                            ? "bg-chart-2"
                            : "bg-destructive"
                        }`}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Risk Score: {analysis.score}/100
                    </p>
                  </div>

                  {/* URL Components */}
                  <div className="mb-6 p-4 rounded-lg bg-muted/50">
                    <p className="font-semibold text-foreground mb-3">URL Components</p>
                    <div className="space-y-2 text-sm">
                      {analysis.details.protocol && (
                        <div>
                          <span className="text-muted-foreground">Protocol:</span>
                          <span className="ml-2 font-mono text-foreground">
                            {analysis.details.protocol}://
                          </span>
                        </div>
                      )}
                      {analysis.details.subdomain && (
                        <div>
                          <span className="text-muted-foreground">Subdomain:</span>
                          <span className="ml-2 font-mono text-foreground">
                            {analysis.details.subdomain}.
                          </span>
                        </div>
                      )}
                      {analysis.details.domain && (
                        <div>
                          <span className="text-muted-foreground">Domain:</span>
                          <span className="ml-2 font-mono font-bold text-primary">
                            {analysis.details.domain}
                          </span>
                          <InfoTooltip
                            title="Domain"
                            content="The main domain name. Always verify this carefully - it's the actual website owner."
                            position="top"
                          />
                        </div>
                      )}
                      {analysis.details.tld && (
                        <div>
                          <span className="text-muted-foreground">TLD:</span>
                          <span className="ml-2 font-mono text-foreground">
                            .{analysis.details.tld}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </AnimatedCard>

                {/* Issues */}
                {analysis.issues.length > 0 && (
                  <AnimatedCard variant="warning">
                    <h3 className="text-lg font-bold text-destructive mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" /> Issues Found
                    </h3>
                    <div className="space-y-3">
                      {analysis.issues.map((issue, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-start gap-3 p-3 rounded-lg bg-background/50"
                        >
                          <span className="text-destructive font-bold text-lg">!</span>
                          <span className="text-foreground">{issue}</span>
                        </motion.div>
                      ))}
                    </div>
                  </AnimatedCard>
                )}

                {/* Warnings */}
                {analysis.warnings.length > 0 && (
                  <AnimatedCard variant="accent">
                    <h3 className="text-lg font-bold text-chart-2 mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" /> Warnings
                    </h3>
                    <div className="space-y-3">
                      {analysis.warnings.map((warning, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-start gap-3 p-3 rounded-lg bg-background/50"
                        >
                          <span className="text-chart-2 font-bold text-lg">⚠</span>
                          <span className="text-foreground">{warning}</span>
                        </motion.div>
                      ))}
                    </div>
                  </AnimatedCard>
                )}

                {/* Positives */}
                {analysis.positives.length > 0 && (
                  <AnimatedCard variant="default">
                    <h3 className="text-lg font-bold text-chart-4 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" /> Positive Indicators
                    </h3>
                    <div className="space-y-3">
                      {analysis.positives.map((positive, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-start gap-3 p-3 rounded-lg bg-background/50"
                        >
                          <span className="text-chart-4 font-bold text-lg">✓</span>
                          <span className="text-foreground">{positive}</span>
                        </motion.div>
                      ))}
                    </div>
                  </AnimatedCard>
                )}
              </div>
            ) : (
              <AnimatedCard variant="default" className="text-center py-12">
                <p className="text-muted-foreground mb-4">Enter a URL above to see analysis</p>
                <DoodleShape type="blob" color="bg-chart-1" size="md" opacity={0.2} className="mx-auto" />
              </AnimatedCard>
            )}
          </motion.div>
        </div>

        {/* Educational Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <AnimatedCard variant="default">
            <h3 className="text-xl font-bold text-foreground mb-4">
              🎓 Common Phishing Tactics
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Typosquatting</h4>
                <p>
                  Attackers register domains similar to legitimate ones (e.g., "amaz0n.com" instead
                  of "amazon.com"). Always verify domain spelling carefully.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Subdomain Spoofing</h4>
                <p>
                  Fake: "google.com.attacker.com" looks like Google but "attacker.com" is the real
                  domain. Always check the domain AFTER the last dot.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Protocol Downgrade</h4>
                <p>
                  Using HTTP instead of HTTPS means data travels unencrypted. Never enter passwords
                  on HTTP sites. Look for the padlock icon.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Urgency & Authority</h4>
                <p>
                  Phishing emails use urgency ("Verify now!") and fake authority ("From IT"). Real
                  companies don't ask you to verify via email links.
                </p>
              </div>
            </div>
          </AnimatedCard>
        </motion.div>
      </div>
    </div>
  );
}
