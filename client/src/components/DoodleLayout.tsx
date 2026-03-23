import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Shield, Lock, Link as LinkIcon, Home, Smartphone } from "lucide-react";

/**
 * DoodleLayout Component
 *
 * Provides the main navigation and layout structure for the Personal Digital Threat Detector.
 * Features:
 * - Top navigation bar with doodle-themed styling
 * - Navigation links to all main pages (Home, Password Checker, URL Checker)
 * - Animated transitions between pages using Framer Motion
 * - Decorative doodle elements (geometric shapes) in the background
 * - Responsive design that works on mobile and desktop
 *
 * Educational Purpose:
 * This layout demonstrates how to create a cohesive user experience by:
 * 1. Maintaining consistent branding across all pages
 * 2. Using visual hierarchy to guide users through different security tools
 * 3. Implementing smooth animations to make the interface feel responsive and engaging
 */

interface DoodleLayoutProps {
  children: React.ReactNode;
}

export default function DoodleLayout({ children }: DoodleLayoutProps) {
  const [location] = useLocation();

  // Navigation items with icons and paths
  const navItems = [
    { label: "Home", path: "/", icon: Home },
    { label: "Password Checker", path: "/password-checker", icon: Lock },
    { label: "URL Checker", path: "/url-checker", icon: LinkIcon },
    { label: "2FA Checker", path: "/2fa-checker", icon: Smartphone },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Decorative Background Elements - Doodle Aesthetic */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Floating Geometric Shapes for Visual Interest */}
        <motion.div
          className="absolute top-10 left-10 w-24 h-24 rounded-full bg-chart-2 opacity-10"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/4 right-20 w-32 h-32 bg-chart-3 opacity-10 rounded-3xl"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-20 left-1/3 w-40 h-40 border-4 border-chart-1 opacity-5 rounded-full"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/3 right-10 w-20 h-20 bg-chart-1 opacity-8 rounded-lg"
          animate={{ rotate: [0, -360] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b-2 border-border doodle-shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <Shield className="w-8 h-8 text-primary" />
                <motion.div
                  className="absolute inset-0 bg-primary rounded-full opacity-20"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <h1 className="text-xl font-bold text-primary hidden sm:block">
                Digital Threat Detector
              </h1>
              <h1 className="text-lg font-bold text-primary sm:hidden">DTD</h1>
            </motion.div>

            {/* Navigation Links */}
            <div className="flex items-center gap-1 sm:gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.path;

                return (
                  <motion.a
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${ isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-secondary/50"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content with Fade Animation */}
      <motion.main
        key={location}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="relative z-10"
      >
        {children}
      </motion.main>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t-2 border-border bg-card/50">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="mb-2">
            🛡️ Personal Digital Threat Detector - Educational Tool for Cybersecurity Awareness
          </p>
          <p className="text-sm">
            Learn to protect yourself from common digital threats with interactive tools and educational content.
          </p>
        </div>
      </footer>
    </div>
  );
}
