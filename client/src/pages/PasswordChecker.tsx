import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Copy, Check } from "lucide-react";
import AnimatedCard from "@/components/AnimatedCard";
import DoodleShape from "@/components/DoodleShape";
import InfoTooltip from "@/components/InfoTooltip";

/**
 * Password Strength Checker Page
 *
 * This page demonstrates core cybersecurity principles through interactive password analysis.
 *
 * Educational Objectives:
 * 1. Teach password entropy and complexity requirements
 * 2. Explain brute-force attack time calculations
 * 3. Show real-world password cracking speeds
 * 4. Provide actionable recommendations
 *
 * Cybersecurity Concepts Explained:
 *
 * PASSWORD ENTROPY:
 * - Entropy measures password randomness and strength
 * - Formula: E = log2(R^L) where R = character set size, L = password length
 * - Higher entropy = harder to crack
 * - Example: "abc123" has low entropy (predictable pattern)
 *           "Kx9#mP2@Lq" has high entropy (random characters)
 *
 * CHARACTER SETS:
 * - Lowercase letters: 26 possibilities
 * - Uppercase letters: 26 possibilities
 * - Numbers: 10 possibilities
 * - Special characters: ~32 possibilities
 * - Total possible: 94 characters (lowercase + uppercase + numbers + special)
 *
 * BRUTE-FORCE ATTACK TIME:
 * - Assumes attacker tries every possible combination
 * - Modern GPU can attempt ~1 billion passwords per second
 * - Formula: Time = (2^entropy) / (guesses_per_second * 2)
 * - The /2 factor assumes average case (attacker finds password halfway through)
 *
 * REAL-WORLD CONTEXT:
 * - Most breaches don't use brute-force; they use stolen password hashes
 * - Hashing makes passwords harder to crack (requires hash reversal)
 * - But weak passwords are still vulnerable to dictionary attacks
 * - Strong passwords protect against all attack methods
 */

interface PasswordAnalysis {
  strength: "weak" | "fair" | "good" | "strong" | "very-strong";
  score: number;
  entropy: number;
  crackTime: string;
  feedback: string[];
  suggestions: string[];
}

export default function PasswordChecker() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  /**
   * Calculate Password Entropy
   *
   * Entropy represents the number of bits of randomness in a password.
   * It's calculated using the formula: E = log2(R^L)
   * where R is the size of the character set and L is the password length.
   *
   * Example calculation for "Kx9#mP2@Lq":
   * - Uses lowercase, uppercase, numbers, and special chars = 94 character set
   * - Length = 10
   * - Entropy = log2(94^10) ≈ 65.7 bits
   * - This is considered very strong
   */
  const calculateEntropy = (pwd: string): number => {
    if (!pwd) return 0;

    // Determine character set size based on what's in the password
    let charsetSize = 0;

    // Check for lowercase letters (a-z)
    if (/[a-z]/.test(pwd)) charsetSize += 26;

    // Check for uppercase letters (A-Z)
    if (/[A-Z]/.test(pwd)) charsetSize += 26;

    // Check for digits (0-9)
    if (/\d/.test(pwd)) charsetSize += 10;

    // Check for special characters
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) charsetSize += 32;

    // Calculate entropy using the formula: log2(charset_size^password_length)
    // This simplifies to: password_length * log2(charset_size)
    const entropy = pwd.length * Math.log2(charsetSize);

    return entropy;
  };

  /**
   * Estimate Time to Crack Password via Brute-Force Attack
   *
   * This calculation assumes:
   * 1. Attacker knows the password contains certain character types
   * 2. Attacker has modern GPU hardware (~1 billion guesses/second)
   * 3. On average, password is found at 50% of attempts (hence /2)
   *
   * Real-world context:
   * - This is a WORST-CASE scenario (pure brute-force)
   * - Most actual attacks use:
   *   a) Dictionary attacks (common words) - much faster
   *   b) Rainbow tables (pre-computed hashes) - instant if available
   *   c) Social engineering - bypasses technical security
   *
   * The purpose is educational: to show why strong passwords matter
   * even though most breaches don't use brute-force.
   */
  const estimateCrackTime = (entropy: number): string => {
    // Assume modern GPU can attempt ~1 billion (10^9) passwords per second
    // This is a realistic estimate for GPU-accelerated cracking
    const guessesPerSecond = 1e9;

    // Total possible combinations = 2^entropy
    // Average case = 2^entropy / 2 (found halfway through)
    const totalAttempts = Math.pow(2, entropy) / 2;

    // Time in seconds
    const seconds = totalAttempts / guessesPerSecond;

    // Convert to human-readable format
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
  };

  /**
   * Analyze Password Strength
   *
   * This function evaluates multiple aspects of password security:
   * 1. Length: Minimum 8 characters recommended, 12+ is strong
   * 2. Character diversity: Mix of uppercase, lowercase, numbers, special chars
   * 3. Entropy: Overall randomness and complexity
   * 4. Common patterns: Avoids predictable sequences
   *
   * Scoring system:
   * - Weak (0-30): Easy to crack, common patterns
   * - Fair (30-50): Moderate protection
   * - Good (50-70): Solid protection
   * - Strong (70-90): Very difficult to crack
   * - Very Strong (90+): Excellent protection
   */
  const analyzePassword = (pwd: string): PasswordAnalysis => {
    const feedback: string[] = [];
    const suggestions: string[] = [];
    let score = 0;

    // Length analysis
    if (pwd.length === 0) {
      return {
        strength: "weak",
        score: 0,
        entropy: 0,
        crackTime: "N/A",
        feedback: ["Enter a password to analyze"],
        suggestions: ["Create a password at least 12 characters long"],
      };
    }

    if (pwd.length < 8) {
      feedback.push("Password is too short");
      suggestions.push("Use at least 8 characters (12+ is recommended)");
      score += 5;
    } else if (pwd.length < 12) {
      feedback.push("Password length is acceptable but could be longer");
      score += 15;
    } else if (pwd.length < 16) {
      feedback.push("Good password length");
      score += 25;
    } else {
      feedback.push("Excellent password length");
      score += 35;
    }

    // Character type analysis
    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumbers = /\d/.test(pwd);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);

    let charTypeCount = 0;
    if (hasLower) charTypeCount++;
    if (hasUpper) charTypeCount++;
    if (hasNumbers) charTypeCount++;
    if (hasSpecial) charTypeCount++;

    if (charTypeCount < 2) {
      feedback.push("Password lacks character diversity");
      suggestions.push("Mix uppercase, lowercase, numbers, and special characters");
      score += 5;
    } else if (charTypeCount === 2) {
      feedback.push("Password has some character diversity");
      score += 15;
    } else if (charTypeCount === 3) {
      feedback.push("Good character diversity");
      score += 25;
    } else {
      feedback.push("Excellent character diversity");
      score += 35;
    }

    // Common pattern detection
    const commonPatterns = [
      /^[a-z]+$/i, // Only letters
      /^\d+$/, // Only numbers
      /^[a-z0-9]+$/i, // Only letters and numbers
      /(.)\1{2,}/, // Repeating characters (aaa, 111)
      /^(123|abc|qwerty|password|admin|letmein)/i, // Common passwords
      /^[a-z]{1,3}\d{1,3}$/i, // Pattern like abc123
    ];

    const hasCommonPattern = commonPatterns.some((pattern) => pattern.test(pwd));

    if (hasCommonPattern) {
      feedback.push("Password contains common patterns");
      suggestions.push("Avoid sequential numbers, repeated characters, or dictionary words");
      score += 5;
    } else {
      feedback.push("No obvious patterns detected");
      score += 15;
    }

    // Calculate entropy
    const entropy = calculateEntropy(pwd);
    const crackTime = estimateCrackTime(entropy);

    // Determine strength level
    let strength: "weak" | "fair" | "good" | "strong" | "very-strong";
    if (score < 20) strength = "weak";
    else if (score < 40) strength = "fair";
    else if (score < 60) strength = "good";
    else if (score < 80) strength = "strong";
    else strength = "very-strong";

    // Add specific suggestions
    if (!hasUpper) suggestions.push("Add uppercase letters (A-Z)");
    if (!hasNumbers) suggestions.push("Include numbers (0-9)");
    if (!hasSpecial) suggestions.push("Include special characters (!@#$%^&*)");

    return {
      strength,
      score: Math.min(score, 100),
      entropy: Math.round(entropy * 10) / 10,
      crackTime,
      feedback,
      suggestions: suggestions.slice(0, 3), // Limit to 3 suggestions
    };
  };

  const analysis = useMemo(() => analyzePassword(password), [password]);

  // Strength color mapping
  const strengthColors = {
    weak: "text-destructive",
    fair: "text-chart-2",
    good: "text-chart-1",
    strong: "text-primary",
    "very-strong": "text-chart-4",
  };

  const strengthBgColors = {
    weak: "bg-destructive/20",
    fair: "bg-chart-2/20",
    good: "bg-chart-1/20",
    strong: "bg-primary/20",
    "very-strong": "bg-chart-4/20",
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
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
            Password Strength Checker
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Analyze your password strength, estimate crack time, and get personalized recommendations
            to improve your security.
          </p>
        </motion.div>

        {/* Decorative Shapes */}
        <div className="absolute top-20 right-10 pointer-events-none">
          <DoodleShape type="circle" color="bg-chart-2" size="lg" opacity={0.1} />
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
              <h2 className="text-xl font-bold text-foreground mb-4">Enter Password</h2>

              {/* Password Input */}
              <div className="relative mb-4">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password to analyze..."
                  className="doodle-input"
                />
                <motion.button
                  onClick={() => setShowPassword(!showPassword)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
              </div>

              {/* Copy Button */}
              {password && (
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
                      <Copy className="w-4 h-4" /> Copy Password
                    </>
                  )}
                </motion.button>
              )}

              {/* Info Box */}
              <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                <p className="font-semibold mb-2">💡 Pro Tips:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Use 12+ characters for strong protection</li>
                  <li>• Mix uppercase, lowercase, numbers & symbols</li>
                  <li>• Avoid dictionary words and patterns</li>
                  <li>• Never reuse passwords across accounts</li>
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
            {password ? (
              <div className="space-y-6">
                {/* Strength Meter */}
                <AnimatedCard variant="default">
                  <h3 className="text-lg font-bold text-foreground mb-4">Strength Analysis</h3>

                  {/* Strength Level */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-foreground">Overall Strength</span>
                      <motion.span
                        key={analysis.strength}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`text-lg font-bold px-4 py-1 rounded-full ${strengthBgColors[analysis.strength]} ${strengthColors[analysis.strength]}`}
                      >
                        {analysis.strength.replace("-", " ").toUpperCase()}
                      </motion.span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-3 bg-border rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${analysis.score}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`h-full rounded-full ${ analysis.strength === "weak"
                          ? "bg-destructive"
                          : analysis.strength === "fair"
                            ? "bg-chart-2"
                            : analysis.strength === "good"
                              ? "bg-chart-1"
                              : analysis.strength === "strong"
                                ? "bg-primary"
                                : "bg-chart-4"
                        }`}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Score: {analysis.score}/100
                    </p>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">Entropy (bits)</p>
                      <p className="text-2xl font-bold text-primary">{analysis.entropy}</p>
                      <InfoTooltip
                        title="Password Entropy"
                        content="Measures randomness. Higher entropy = harder to crack. Formula: log2(charset_size^length)"
                        position="top"
                      />
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">Crack Time</p>
                      <p className="text-sm font-bold text-primary">{analysis.crackTime}</p>
                      <InfoTooltip
                        title="Brute-Force Time"
                        content="Estimated time to crack via brute-force attack with modern GPU (~1B guesses/sec)"
                        position="top"
                      />
                    </div>
                  </div>

                  {/* Feedback */}
                  <div>
                    <p className="font-semibold text-foreground mb-3">Feedback</p>
                    <div className="space-y-2">
                      {analysis.feedback.map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-start gap-2 text-sm"
                        >
                          <span className="text-primary mt-1">✓</span>
                          <span className="text-muted-foreground">{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </AnimatedCard>

                {/* Suggestions */}
                {analysis.suggestions.length > 0 && (
                  <AnimatedCard variant="accent">
                    <h3 className="text-lg font-bold text-foreground mb-4">Recommendations</h3>
                    <div className="space-y-3">
                      {analysis.suggestions.map((suggestion, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-start gap-3 p-3 rounded-lg bg-background/50"
                        >
                          <span className="text-accent font-bold text-lg">→</span>
                          <span className="text-foreground">{suggestion}</span>
                        </motion.div>
                      ))}
                    </div>
                  </AnimatedCard>
                )}
              </div>
            ) : (
              <AnimatedCard variant="default" className="text-center py-12">
                <p className="text-muted-foreground mb-4">Enter a password above to see analysis</p>
                <DoodleShape type="circle" color="bg-chart-3" size="md" opacity={0.2} className="mx-auto" />
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
              🎓 How Password Cracking Works
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Brute-Force Attack</h4>
                <p>
                  Attacker tries every possible combination. Modern GPUs can attempt ~1 billion
                  passwords per second. Strong passwords with high entropy make this impractical.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Dictionary Attack</h4>
                <p>
                  Attacker uses common words and patterns. This is faster than brute-force but
                  fails against random, complex passwords.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Rainbow Tables</h4>
                <p>
                  Pre-computed hashes of common passwords. Instant lookup if your password is in
                  the table. Unique, strong passwords avoid this.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Real-World Breaches</h4>
                <p>
                  Most breaches don't crack passwords—they steal hashes. But weak passwords are
                  still vulnerable. Always use strong, unique passwords.
                </p>
              </div>
            </div>
          </AnimatedCard>
        </motion.div>
      </div>
    </div>
  );
}
