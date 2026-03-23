import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { useState } from "react";

/**
 * InfoTooltip Component
 *
 * Provides educational information about security concepts in a tooltip format.
 * This component is essential for making cybersecurity accessible to beginners.
 *
 * Design Principles:
 * 1. Non-intrusive: Tooltips appear on demand, not forcing information on users
 * 2. Contextual: Appears near the relevant content
 * 3. Dismissible: Users can close it to continue
 * 4. Animated: Smooth entrance/exit animations reduce jarring transitions
 *
 * Educational Purpose:
 * Tooltips serve multiple learning objectives:
 * - Provide just-in-time learning (information when users need it)
 * - Reduce cognitive overload by not showing everything at once
 * - Allow users to self-pace their learning
 * - Explain technical terms in beginner-friendly language
 *
 * Cybersecurity Context:
 * When explaining security concepts, we use tooltips to:
 * - Define technical terms (e.g., \"entropy\", \"brute-force attack\")
 * - Explain why certain practices matter (e.g., \"Why use uppercase letters?\")
 * - Provide real-world examples of threats
 * - Offer actionable recommendations
 */

interface InfoTooltipProps {
  title: string;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export default function InfoTooltip({
  title,
  content,
  position = "top",
  className = "",
}: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Position mapping for tooltip placement
  const positionMap = {
    top: "-top-2 -translate-y-full left-1/2 -translate-x-1/2",
    bottom: "-bottom-2 translate-y-full left-1/2 -translate-x-1/2",
    left: "top-1/2 -translate-y-1/2 -left-2 -translate-x-full",
    right: "top-1/2 -translate-y-1/2 -right-2 translate-x-full",
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Help Icon Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`Information about ${title}`}
      >
        <HelpCircle className="w-4 h-4" />
      </motion.button>

      {/* Tooltip Content */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop to close tooltip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />

            {/* Tooltip Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className={`
                absolute z-50 ${positionMap[position]}
                bg-card border-2 border-primary rounded-lg p-3
                shadow-lg max-w-xs w-64
              `}
            >
              {/* Tooltip Arrow */}
              <div
                className={`
                  absolute w-3 h-3 bg-card border-2 border-primary
                  ${position === "top" ? "-bottom-1.5 left-1/2 -translate-x-1/2 rotate-45" : ""}
                  ${position === "bottom" ? "-top-1.5 left-1/2 -translate-x-1/2 rotate-45" : ""}
                  ${position === "left" ? "-right-1.5 top-1/2 -translate-y-1/2 rotate-45" : ""}
                  ${position === "right" ? "-left-1.5 top-1/2 -translate-y-1/2 rotate-45" : ""}
                `}
              />

              {/* Tooltip Content */}
              <div className="relative">
                <h4 className="font-bold text-sm text-primary mb-1">{title}</h4>
                <p className="text-xs text-foreground leading-relaxed">{content}</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
