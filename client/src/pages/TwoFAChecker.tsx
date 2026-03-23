import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertTriangle, Smartphone, Fingerprint, MessageSquare, Shield } from "lucide-react";
import AnimatedCard from "@/components/AnimatedCard";
import DoodleShape from "@/components/DoodleShape";
import InfoTooltip from "@/components/InfoTooltip";

/**
 * Two-Factor Authentication (2FA) Checker Page
 *
 * This page educates users about different 2FA methods and helps them choose
 * the best method for their specific use case.
 *
 * Educational Objectives:
 * 1. Understand what 2FA is and why it matters
 * 2. Compare different 2FA methods (SMS, Authenticator App, Biometric)
 * 3. Learn pros and cons of each method
 * 4. Make informed decisions about which method to use
 *
 * Cybersecurity Concepts Explained:
 *
 * TWO-FACTOR AUTHENTICATION (2FA):
 * - "Something you know" (password) + "Something you have" (phone, device)
 * - Or: "Something you know" + "Something you are" (biometric)
 * - Requires attacker to compromise TWO separate systems
 * - Dramatically increases security even if password is weak
 *
 * SECURITY PRINCIPLE - DEFENSE IN DEPTH:
 * - Single factor (password): Vulnerable to brute-force, phishing, leaks
 * - Two factors: Attacker needs BOTH password AND access to second factor
 * - Example: Even if password is stolen, attacker can't access account
 *   without the second factor (phone, authenticator app, or biometric)
 *
 * METHOD COMPARISON:
 *
 * 1. SMS 2FA (Least Secure)
 *    - Mechanism: Code sent via text message
 *    - Security: Vulnerable to SIM swapping, interception, social engineering
 *    - Availability: Works on any phone with SMS capability
 *    - Cost: Free (included in phone plan)
 *    - User Experience: Simple, familiar
 *
 * 2. Authenticator App 2FA (Recommended)
 *    - Mechanism: Time-based One-Time Password (TOTP) or HMAC-based OTP (HOTP)
 *    - Security: Much stronger than SMS, immune to SIM swapping
 *    - Availability: Requires smartphone with authenticator app
 *    - Cost: Free (apps like Google Authenticator, Authy, Microsoft Authenticator)
 *    - User Experience: Requires manual entry or QR code scan
 *
 * 3. Biometric 2FA (Most Secure)
 *    - Mechanism: Fingerprint, face recognition, or other biometric
 *    - Security: Extremely difficult to spoof, tied to device
 *    - Availability: Requires device with biometric hardware
 *    - Cost: Built into modern smartphones
 *    - User Experience: Fastest, most convenient
 *
 * REAL-WORLD CONTEXT:
 * - SIM Swapping: Attacker convinces carrier to transfer phone number to new SIM
 * - SMS Interception: Possible in certain network conditions or with compromised carrier
 * - Authenticator Apps: Immune to these attacks because they don't rely on SMS
 * - Biometric: Tied to device, can't be intercepted remotely
 *
 * BEST PRACTICES:
 * - Use authenticator app or biometric for sensitive accounts (email, banking)
 * - SMS is better than nothing, but not ideal for high-value accounts
 * - Use backup codes (printed and stored securely) in case you lose access
 * - Enable 2FA on all accounts that support it
 */

interface TwoFAMethod {
  id: "sms" | "authenticator" | "biometric";
  name: string;
  icon: React.ElementType;
  description: string;
  securityLevel: "low" | "medium" | "high";
  pros: string[];
  cons: string[];
  useCases: string[];
  technicalDetails: {
    mechanism: string;
    vulnerabilities: string[];
    recoveryOptions: string[];
  };
}

export default function TwoFAChecker() {
  const [selectedMethod, setSelectedMethod] = useState<"sms" | "authenticator" | "biometric" | null>(null);
  const [useCase, setUseCase] = useState<"personal" | "banking" | "work" | null>(null);

  /**
   * 2FA Methods Database
   *
   * Comprehensive information about each 2FA method including:
   * - Security level assessment
   * - Pros and cons for different scenarios
   * - Technical implementation details
   * - Real-world vulnerabilities
   */
  const twoFAMethods: TwoFAMethod[] = [
    {
      id: "sms",
      name: "SMS Text Message",
      icon: MessageSquare,
      description: "Verification code sent via text message to your phone",
      securityLevel: "low",
      pros: [
        "Works on any phone with SMS capability",
        "No need to install additional apps",
        "Familiar to most users",
        "Widely supported by services",
      ],
      cons: [
        "Vulnerable to SIM swapping attacks",
        "Can be intercepted in certain conditions",
        "Requires cellular signal or data connection",
        "Slower than other methods",
        "Carrier can be social engineered",
      ],
      useCases: [
        "Low-security accounts (social media, forums)",
        "As a fallback when other methods unavailable",
        "Accounts with less sensitive data",
      ],
      technicalDetails: {
        mechanism:
          "Service sends 6-digit code via SMS. User enters code within time limit (usually 5-10 minutes). Code is one-time use only.",
        vulnerabilities: [
          "SIM Swapping: Attacker convinces carrier to transfer your number to their SIM",
          "SMS Interception: Possible with compromised carrier or network access",
          "Social Engineering: Attacker calls carrier pretending to be you",
          "Man-in-the-Middle: Interception on unencrypted networks",
        ],
        recoveryOptions: [
          "Backup phone number (if registered)",
          "Recovery codes (if generated)",
          "Account recovery process",
        ],
      },
    },
    {
      id: "authenticator",
      name: "Authenticator App",
      icon: Smartphone,
      description: "Time-based code generated by app on your phone (Google Authenticator, Authy, etc.)",
      securityLevel: "high",
      pros: [
        "Much more secure than SMS",
        "Immune to SIM swapping",
        "Can't be intercepted remotely",
        "Works offline (no internet needed)",
        "Fast and convenient",
        "Free apps available",
      ],
      cons: [
        "Requires smartphone with app installed",
        "If phone is lost, access can be difficult",
        "Requires backup codes or recovery method",
        "Slightly longer setup process",
      ],
      useCases: [
        "Email accounts (Gmail, Outlook, etc.)",
        "Banking and financial accounts",
        "Work/professional accounts",
        "Cryptocurrency wallets",
        "Any high-value account",
      ],
      technicalDetails: {
        mechanism:
          "Uses Time-based One-Time Password (TOTP) algorithm. Shared secret between service and app. Generates new 6-digit code every 30 seconds. Code is time-synchronized.",
        vulnerabilities: [
          "Device Loss: If phone is lost, attacker with physical access could potentially extract secrets",
          "Malware: Malicious app on phone could read authenticator codes",
          "Backup Compromise: If backup codes are stolen, attacker can access account",
        ],
        recoveryOptions: [
          "Backup codes (printed and stored securely)",
          "Recovery email address",
          "Account recovery process",
          "Secondary authenticator app on another device",
        ],
      },
    },
    {
      id: "biometric",
      name: "Biometric (Fingerprint/Face)",
      icon: Fingerprint,
      description: "Fingerprint, face recognition, or other biometric authentication on your device",
      securityLevel: "high",
      pros: [
        "Fastest and most convenient",
        "Extremely difficult to spoof",
        "Tied to device, can't be intercepted",
        "No codes to remember or lose",
        "Built into modern phones",
        "Works offline",
      ],
      cons: [
        "Requires device with biometric hardware",
        "Less widely supported than other methods",
        "If device is compromised, biometric can be bypassed",
        "Privacy concerns for some users",
      ],
      useCases: [
        "Mobile banking apps",
        "Payment apps (Apple Pay, Google Pay)",
        "Cryptocurrency exchanges",
        "High-security work applications",
        "Personal device unlocking",
      ],
      technicalDetails: {
        mechanism:
          "Biometric data (fingerprint or facial features) is stored securely on device. Authentication happens locally on device. Service never sees actual biometric data, only confirmation.",
        vulnerabilities: [
          "Device Compromise: If device is hacked, biometric can be bypassed",
          "Spoofing: Advanced spoofing techniques (fake fingerprints, deepfakes) possible but difficult",
          "Backup Access: If biometric fails, fallback method (password) must be used",
        ],
        recoveryOptions: [
          "Fallback password authentication",
          "Recovery codes",
          "Account recovery process",
          "Alternative device with biometric",
        ],
      },
    },
  ];

  /**
   * Get Recommendation Based on Use Case
   *
   * This function analyzes the user's use case and recommends
   * the best 2FA method for their specific scenario.
   */
  const getRecommendation = (useCase: "personal" | "banking" | "work"): string => {
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
  };

  /**
   * Calculate Security Score
   *
   * Compares security levels of different methods
   * Score: 0-100 (higher is more secure)
   */
  const getSecurityScore = (method: "sms" | "authenticator" | "biometric"): number => {
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
  };

  const selectedMethodData = twoFAMethods.find((m) => m.id === selectedMethod);

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
            Two-Factor Authentication (2FA) Checker
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Compare different 2FA methods and learn which one is best for your security needs. Understand
            the pros, cons, and real-world vulnerabilities of each approach.
          </p>
        </motion.div>

        {/* Decorative Shapes */}
        <div className="absolute top-20 right-10 pointer-events-none">
          <DoodleShape type="circle" color="bg-chart-2" size="lg" opacity={0.1} />
        </div>

        {/* Use Case Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12 max-w-4xl mx-auto"
        >
          <AnimatedCard variant="default">
            <h2 className="text-xl font-bold text-foreground mb-6">What's Your Use Case?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: "personal", label: "Personal Account", emoji: "👤" },
                { id: "banking", label: "Banking/Financial", emoji: "🏦" },
                { id: "work", label: "Work Account", emoji: "💼" },
              ].map((option) => (
                <motion.button
                  key={option.id}
                  onClick={() => setUseCase(option.id as "personal" | "banking" | "work")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-center font-semibold ${
                    useCase === option.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-2xl mb-2">{option.emoji}</div>
                  {option.label}
                </motion.button>
              ))}
            </div>
          </AnimatedCard>
        </motion.div>

        {/* 2FA Methods Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">2FA Methods Comparison</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {twoFAMethods.map((method, idx) => {
              const Icon = method.icon;
              const securityScore = getSecurityScore(method.id);

              return (
                <motion.div
                  key={method.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <motion.button
                    onClick={() => setSelectedMethod(method.id)}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-left doodle-card border-2 rounded-xl p-6 transition-all duration-300 ${
                      selectedMethod === method.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`p-3 rounded-lg ${
                          method.securityLevel === "low"
                            ? "bg-destructive/20"
                            : method.securityLevel === "medium"
                              ? "bg-chart-2/20"
                              : "bg-chart-4/20"
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 ${
                            method.securityLevel === "low"
                              ? "text-destructive"
                              : method.securityLevel === "medium"
                                ? "text-chart-2"
                                : "text-chart-4"
                          }`}
                        />
                      </motion.div>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded ${
                          method.securityLevel === "low"
                            ? "bg-destructive/20 text-destructive"
                            : method.securityLevel === "medium"
                              ? "bg-chart-2/20 text-chart-2"
                              : "bg-chart-4/20 text-chart-4"
                        }`}
                      >
                        {method.securityLevel.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-foreground mb-2">{method.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{method.description}</p>

                    {/* Security Score */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-muted-foreground">Security Score</span>
                        <span className="text-sm font-bold text-primary">{securityScore}/100</span>
                      </div>
                      <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${securityScore}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className={`h-full rounded-full ${
                            method.securityLevel === "low"
                              ? "bg-destructive"
                              : method.securityLevel === "medium"
                                ? "bg-chart-2"
                                : "bg-chart-4"
                          }`}
                        />
                      </div>
                    </div>

                    <motion.span
                      className="inline-flex items-center gap-2 text-primary font-semibold text-sm"
                      whileHover={{ x: 4 }}
                    >
                      Learn More →
                    </motion.span>
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Detailed Method Information */}
        <AnimatePresence>
          {selectedMethodData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-12"
            >
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Pros & Cons */}
                <div className="space-y-6">
                  <AnimatedCard variant="default">
                    <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-chart-4" /> Advantages
                    </h3>
                    <div className="space-y-3">
                      {selectedMethodData.pros.map((pro, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-start gap-3 p-3 rounded-lg bg-chart-4/10"
                        >
                          <span className="text-chart-4 font-bold text-lg flex-shrink-0">✓</span>
                          <span className="text-foreground text-sm">{pro}</span>
                        </motion.div>
                      ))}
                    </div>
                  </AnimatedCard>

                  <AnimatedCard variant="warning">
                    <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-destructive" /> Disadvantages
                    </h3>
                    <div className="space-y-3">
                      {selectedMethodData.cons.map((con, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10"
                        >
                          <span className="text-destructive font-bold text-lg flex-shrink-0">!</span>
                          <span className="text-foreground text-sm">{con}</span>
                        </motion.div>
                      ))}
                    </div>
                  </AnimatedCard>
                </div>

                {/* Use Cases & Technical Details */}
                <div className="space-y-6">
                  <AnimatedCard variant="default">
                    <h3 className="text-lg font-bold text-foreground mb-4">Best For</h3>
                    <div className="space-y-2">
                      {selectedMethodData.useCases.map((useCase, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-start gap-3 p-2"
                        >
                          <span className="text-primary font-bold">→</span>
                          <span className="text-foreground text-sm">{useCase}</span>
                        </motion.div>
                      ))}
                    </div>
                  </AnimatedCard>

                  <AnimatedCard variant="default">
                    <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" /> How It Works
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {selectedMethodData.technicalDetails.mechanism}
                    </p>

                    <div className="mb-4">
                      <p className="text-xs font-semibold text-foreground mb-2">Vulnerabilities:</p>
                      <ul className="space-y-1">
                        {selectedMethodData.technicalDetails.vulnerabilities.map((vuln, idx) => (
                          <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                            <span className="text-destructive">•</span>
                            <span>{vuln}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-foreground mb-2">Recovery Options:</p>
                      <ul className="space-y-1">
                        {selectedMethodData.technicalDetails.recoveryOptions.map((option, idx) => (
                          <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                            <span className="text-chart-4">✓</span>
                            <span>{option}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </AnimatedCard>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recommendation Section */}
        {useCase && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 max-w-4xl mx-auto"
          >
            <AnimatedCard variant="accent">
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Recommendation for {useCase}</h3>
                  <p className="text-foreground">{getRecommendation(useCase)}</p>
                </div>
              </div>
            </AnimatedCard>
          </motion.div>
        )}

        {/* Educational Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <AnimatedCard variant="default">
            <h3 className="text-xl font-bold text-foreground mb-4">
              🎓 Understanding 2FA Security
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
              <div>
                <h4 className="font-semibold text-foreground mb-2">What is 2FA?</h4>
                <p>
                  Two-Factor Authentication requires two different types of verification:
                  "something you know" (password) and "something you have" (phone, device) or "something you are"
                  (biometric). This makes it exponentially harder for attackers to gain access.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Why It Matters</h4>
                <p>
                  Even if your password is stolen or weak, 2FA prevents unauthorized access. Studies show that
                  2FA blocks 99.9% of account takeover attacks. It's the single most effective security measure
                  you can enable.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">SIM Swapping Attack</h4>
                <p>
                  Attacker calls your carrier pretending to be you, requesting a SIM swap. Your phone number is
                  transferred to attacker's SIM. They then intercept SMS codes. This is why SMS is less secure
                  than authenticator apps.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Best Practices</h4>
                <p>
                  Enable 2FA on ALL accounts that support it. Use authenticator apps or biometric for
                  high-value accounts. Save backup codes in a secure location. Never share 2FA codes with
                  anyone.
                </p>
              </div>
            </div>
          </AnimatedCard>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 max-w-4xl mx-auto"
        >
          <AnimatedCard variant="default">
            <h3 className="text-lg font-bold text-foreground mb-6">Quick Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="text-left py-3 px-4 font-bold text-foreground">Aspect</th>
                    <th className="text-center py-3 px-4 font-bold text-foreground">SMS</th>
                    <th className="text-center py-3 px-4 font-bold text-foreground">Authenticator</th>
                    <th className="text-center py-3 px-4 font-bold text-foreground">Biometric</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 font-semibold text-foreground">Security</td>
                    <td className="text-center py-3 px-4 text-destructive">Low</td>
                    <td className="text-center py-3 px-4 text-chart-4">High</td>
                    <td className="text-center py-3 px-4 text-chart-4">Very High</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 font-semibold text-foreground">Speed</td>
                    <td className="text-center py-3 px-4">Slow</td>
                    <td className="text-center py-3 px-4">Medium</td>
                    <td className="text-center py-3 px-4 text-chart-4">Very Fast</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 font-semibold text-foreground">Availability</td>
                    <td className="text-center py-3 px-4 text-chart-4">Universal</td>
                    <td className="text-center py-3 px-4">Smartphone</td>
                    <td className="text-center py-3 px-4">Modern Device</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-foreground">Cost</td>
                    <td className="text-center py-3 px-4 text-chart-4">Free</td>
                    <td className="text-center py-3 px-4 text-chart-4">Free</td>
                    <td className="text-center py-3 px-4 text-chart-4">Free</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </AnimatedCard>
        </motion.div>
      </div>
    </div>
  );
}
