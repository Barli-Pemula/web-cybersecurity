import { motion } from "framer-motion";

/**
 * DoodleShape Component
 *
 * Renders decorative geometric shapes that create the playful "doodle" aesthetic.
 * These shapes are used throughout the application to:
 * 1. Add visual interest and break up text-heavy sections
 * 2. Create depth through layering and soft shadows
 * 3. Guide user attention to important content
 * 4. Maintain a consistent, friendly design language
 *
 * Educational Design Principle:
 * In cybersecurity education, visual hierarchy is crucial. By using decorative shapes,
 * we make complex security concepts feel less intimidating and more approachable for beginners.
 * The playful aesthetic encourages engagement and reduces "security fatigue."
 *
 * Shape Types:
 * - circle: Represents wholeness, security, protection
 * - square: Represents structure, order, stability
 * - triangle: Represents warning, attention, direction
 * - blob: Organic, friendly shapes for softer messaging
 */

interface DoodleShapeProps {
  type: "circle" | "square" | "triangle" | "blob";
  color?: string; // Tailwind color class (e.g., "bg-chart-1")
  size?: "sm" | "md" | "lg" | "xl";
  opacity?: number;
  animate?: boolean;
  animationType?: "float" | "rotate" | "pulse" | "scale";
  className?: string;
}

type AnimationType = "float" | "rotate" | "pulse" | "scale";

export default function DoodleShape({
  type,
  color = "bg-chart-1",
  size = "md",
  opacity = 0.15,
  animate = true,
  animationType = "float",
  className = "",
}: DoodleShapeProps) {
  // Size mapping for responsive design
  const sizeMap = {
    sm: "w-12 h-12",
    md: "w-24 h-24",
    lg: "w-40 h-40",
    xl: "w-56 h-56",
  };

  // Animation variants for different motion types
  const animationVariants: Record<AnimationType, any> = {
    float: {
      y: [0, 20, 0],
    },
    rotate: {
      rotate: [0, 360],
    },
    pulse: {
      scale: [1, 1.1, 1],
    },
    scale: {
      scale: [0.9, 1.1, 0.9],
    },
  };

  const transitionMap: Record<AnimationType, any> = {
    float: { duration: 4, repeat: Infinity },
    rotate: { duration: 8, repeat: Infinity },
    pulse: { duration: 3, repeat: Infinity },
    scale: { duration: 5, repeat: Infinity },
  };

  // Shape-specific styling
  const shapeStyles = {
    circle: "rounded-full",
    square: "rounded-lg",
    triangle: "clip-path-triangle",
    blob: "rounded-3xl",
  };

  return (
    <motion.div
      className={`${sizeMap[size]} ${color} ${shapeStyles[type]} doodle-shadow pointer-events-none ${className}`}
      style={{ opacity }}
      animate={animate ? animationVariants[animationType as AnimationType] : {}}
      transition={animate ? transitionMap[animationType as AnimationType] : {}}
    />
  );
}
