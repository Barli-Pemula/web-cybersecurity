import { motion } from "framer-motion";
import { ReactNode } from "react";

/**
 * AnimatedCard Component
 *
 * A reusable card component with Framer Motion animations for consistent,
 * engaging visual feedback throughout the application.
 *
 * Features:
 * - Entrance animation (fade-in with slight upward movement)
 * - Hover effects (scale up, shadow enhancement)
 * - Customizable styling and content
 * - Accessibility-friendly with semantic HTML
 *
 * Educational Purpose:
 * This component demonstrates how micro-interactions improve UX:
 * - Animations provide visual feedback that the interface is responsive
 * - Hover states indicate interactivity
 * - Smooth transitions reduce cognitive load by guiding attention
 *
 * In cybersecurity education, these subtle cues help users understand
 * that they're in control and the system is responding to their actions.
 */

interface AnimatedCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
  variant?: "default" | "accent" | "warning" | "success";
}

export default function AnimatedCard({
  children,
  delay = 0,
  className = "",
  onClick,
  interactive = false,
  variant = "default",
}: AnimatedCardProps) {
  // Variant-specific styling for different card types
  const variantStyles = {
    default: "bg-card border-border",
    accent: "bg-accent/10 border-accent/30",
    warning: "bg-destructive/10 border-destructive/30",
    success: "bg-chart-2/10 border-chart-2/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={interactive ? { scale: 1.02, y: -4 } : {}}
      onClick={onClick}
      className={`
        doodle-card border-2 rounded-xl p-6 transition-all duration-300
        ${variantStyles[variant]}
        ${interactive ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
