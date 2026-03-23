import { motion } from "framer-motion";
import { Shield, Lock, AlertTriangle, TrendingUp } from "lucide-react";
import AnimatedCard from "@/components/AnimatedCard";
import DoodleShape from "@/components/DoodleShape";
import InfoTooltip from "@/components/InfoTooltip";

/**
 * Home Page - Personal Digital Threat Detector
 *
 * This page serves as the educational hub of the application, introducing users to:
 * 1. Common digital security threats
 * 2. Why cybersecurity matters for everyday users
 * 3. Available security tools and features
 * 4. Actionable security tips
 *
 * Educational Approach:
 * - Uses statistics to make threats feel real and relevant
 * - Breaks down complex security concepts into digestible pieces
 * - Provides clear calls-to-action to interactive tools
 * - Maintains a friendly, non-intimidating tone
 *
 * Cybersecurity Context:
 * The threats mentioned here are real and documented:
 * - Password breaches: Billions of passwords exposed annually (e.g., LinkedIn, Facebook breaches)
 * - Phishing attacks: Most common entry point for ransomware and data theft
 * - Weak passwords: Majority of breaches involve weak or reused passwords
 * - Social engineering: Humans are often the weakest link in security
 */

export default function Home() {
  // Security statistics - based on real-world cybersecurity reports
  const statistics = [
    {
      icon: AlertTriangle,
      number: "4.3B",
      label: "Password Breaches",
      description: "Passwords exposed in major data breaches annually",
      color: "chart-1",
    },
    {
      icon: Lock,
      number: "90%",
      label: "Phishing Success",
      description: "Of successful breaches start with phishing attacks",
      color: "chart-3",
    },
    {
      icon: TrendingUp,
      number: "81%",
      label: "Weak Passwords",
      description: "Of hacking-related breaches involve weak passwords",
      color: "chart-2",
    },
    {
      icon: Shield,
      number: "1 in 4",
      label: "Malware Risk",
      description: "Internet users encounter malware monthly",
      color: "chart-5",
    },
  ];

  // Security tips for beginners
  const securityTips = [
    {
      title: "Use Strong, Unique Passwords",
      description:
        "Create passwords with 12+ characters mixing uppercase, lowercase, numbers, and symbols. Never reuse passwords across accounts.",
      icon: Lock,
    },
    {
      title: "Enable Two-Factor Authentication",
      description:
        "Add an extra security layer requiring a second verification method (SMS, app, or biometric) beyond your password.",
      icon: Shield,
    },
    {
      title: "Verify Before You Click",
      description:
        "Check sender email addresses, hover over links, and verify URLs before clicking. Phishing emails often look legitimate.",
      icon: AlertTriangle,
    },
    {
      title: "Keep Software Updated",
      description:
        "Security patches fix vulnerabilities. Enable automatic updates for your OS, browser, and applications.",
      icon: TrendingUp,
    },
  ];

  // Feature cards linking to tools
  const features = [
    {
      title: "Password Strength Checker",
      description:
        "Analyze your password strength, estimate how long it would take to crack, and get personalized recommendations.",
      path: "/password-checker",
      icon: Lock,
      color: "accent",
    },
    {
      title: "URL Phishing Checker",
      description:
        "Detect suspicious links, identify typosquatting attempts, and learn about common phishing tactics.",
      path: "/url-checker",
      icon: AlertTriangle,
      color: "warning",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <motion.div
              className="flex items-center justify-center gap-3 mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
              <h1 className="text-3xl sm:text-5xl font-bold text-foreground">
                Digital Security Starts Here
              </h1>
            </motion.div>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Learn to protect yourself from common digital threats with interactive tools and
              educational resources designed for beginners.
            </p>
          </motion.div>

          {/* Decorative Shapes */}
          <div className="absolute -top-10 -left-10 pointer-events-none">
            <DoodleShape type="circle" color="bg-chart-2" size="lg" opacity={0.1} />
          </div>
          <div className="absolute -bottom-20 -right-10 pointer-events-none">
            <DoodleShape type="square" color="bg-chart-3" size="xl" opacity={0.08} />
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 sm:py-16 bg-card/50 border-y-2 border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 text-foreground">
            Why Cybersecurity Matters
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statistics.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <AnimatedCard key={index} delay={index * 0.1} variant="default">
                  <div className="flex flex-col items-center text-center">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`mb-4 p-3 rounded-full bg-${stat.color}/20`}
                    >
                      <Icon className={`w-6 h-6 text-${stat.color}`} />
                    </motion.div>
                    <p className="text-2xl sm:text-3xl font-bold text-primary mb-2">
                      {stat.number}
                    </p>
                    <p className="font-semibold text-foreground mb-2">{stat.label}</p>
                    <p className="text-sm text-muted-foreground">{stat.description}</p>
                  </div>
                </AnimatedCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Tools Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 text-foreground">
            Security Tools
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.a
                  key={index}
                  href={feature.path}
                  initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  whileHover={{ scale: 1.02, y: -8 }}
                  className="group"
                >
                  <div
                    className={`doodle-card border-2 rounded-xl p-8 h-full cursor-pointer transition-all duration-300 ${ feature.color === "accent"
                      ? "bg-accent/10 border-accent/30 hover:bg-accent/15"
                      : "bg-destructive/10 border-destructive/30 hover:bg-destructive/15"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        className={`p-4 rounded-lg ${ feature.color === "accent"
                          ? "bg-accent/20"
                          : "bg-destructive/20"
                        }`}
                      >
                        <Icon
                          className={`w-8 h-8 ${ feature.color === "accent"
                            ? "text-accent"
                            : "text-destructive"
                          }`}
                        />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground mb-4">{feature.description}</p>
                        <motion.span
                          className="inline-flex items-center gap-2 text-primary font-semibold"
                          whileHover={{ x: 4 }}
                        >
                          Try Now →
                        </motion.span>
                      </div>
                    </div>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security Tips Section */}
      <section className="py-12 sm:py-16 bg-card/50 border-t-2 border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 text-foreground">
            Essential Security Tips
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {securityTips.map((tip, index) => {
              const Icon = tip.icon;
              return (
                <AnimatedCard key={index} delay={index * 0.1} variant="default">
                  <div className="flex gap-4">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="flex-shrink-0 p-3 rounded-lg bg-primary/20"
                    >
                      <Icon className="w-6 h-6 text-primary" />
                    </motion.div>
                    <div>
                      <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                        {tip.title}
                        <InfoTooltip
                          title={tip.title}
                          content={tip.description}
                          position="top"
                        />
                      </h3>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </div>
                  </div>
                </AnimatedCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">
              Ready to Secure Your Digital Life?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start by checking your password strength or analyzing suspicious links. Every step
              toward better security counts!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/password-checker"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="doodle-button-primary"
              >
                Check Password Strength
              </motion.a>
              <motion.a
                href="/url-checker"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="doodle-button-accent"
              >
                Analyze a Link
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Decorative Shapes */}
        <div className="absolute top-1/2 -left-20 pointer-events-none">
          <DoodleShape type="blob" color="bg-chart-1" size="xl" opacity={0.08} />
        </div>
        <div className="absolute bottom-10 -right-20 pointer-events-none">
          <DoodleShape type="circle" color="bg-chart-3" size="lg" opacity={0.1} />
        </div>
      </section>
    </div>
  );
}
