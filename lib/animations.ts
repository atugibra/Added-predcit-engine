import type { Variants, Transition } from "framer-motion"

// ─── Shared spring configs ───────────────────────────────────────────
export const smoothSpring: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 30,
}

export const gentleSpring: Transition = {
  type: "spring",
  stiffness: 120,
  damping: 20,
  mass: 0.8,
}

export const snappySpring: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 35,
}

// ─── Fade + Rise (default entrance) ─────────────────────────────────
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: { opacity: 1, y: 0 },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1 },
}

// ─── Slide variants ─────────────────────────────────────────────────
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0 },
}

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0 },
}

// ─── Stagger container ──────────────────────────────────────────────
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
}

// ─── Card hover / tap ───────────────────────────────────────────────
export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -4, transition: smoothSpring },
  tap: { scale: 0.98, transition: snappySpring },
}

export const subtleHover = {
  rest: { scale: 1 },
  hover: { scale: 1.01, transition: smoothSpring },
  tap: { scale: 0.99, transition: snappySpring },
}

// ─── Table row entrance ─────────────────────────────────────────────
export const tableRowVariant: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0 },
}

// ─── Counter / number animation helper ──────────────────────────────
export function getCounterTransition(delay: number = 0): Transition {
  return {
    type: "spring",
    stiffness: 100,
    damping: 20,
    delay,
  }
}

// ─── Glow pulse for live indicators ─────────────────────────────────
export const glowPulse: Variants = {
  initial: { boxShadow: "0 0 0 0 rgba(34,197,94,0)" },
  animate: {
    boxShadow: [
      "0 0 0 0 rgba(34,197,94,0.3)",
      "0 0 12px 4px rgba(34,197,94,0.15)",
      "0 0 0 0 rgba(34,197,94,0)",
    ],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
}

// ─── Page transition wrapper ────────────────────────────────────────
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

export const pageTransitionConfig: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 28,
}
