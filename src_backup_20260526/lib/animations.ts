import type { Variants, Transition } from 'framer-motion';

// ──────────────────────────────────────────────
// Shared transitions
// ──────────────────────────────────────────────

export const spring: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 28,
  mass: 0.8,
};

export const springSnap: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 22,
};

export const smooth: Transition = {
  type: 'tween',
  duration: 0.45,
  ease: [0.25, 0.1, 0.25, 1],
};

export const smoothOut: Transition = {
  type: 'tween',
  duration: 0.35,
  ease: [0.4, 0, 0.2, 1],
};

// ──────────────────────────────────────────────
// Variants
// ──────────────────────────────────────────────

/** Fade in + slide up from 20px */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: spring,
  },
};

/** Fade in + slide up from 30px — for cards */
export const fadeUpCard: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: spring,
  },
};

/** Fade in only */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: smooth,
  },
};

/** Scale in from 0.9 */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springSnap,
  },
};

/** Slide in from left */
export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: spring,
  },
};

/** Slide in from right */
export const slideRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: spring,
  },
};

/** Stagger children — use as parent */
export const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

/** Stagger with faster pace */
export const staggerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
};

/** Number counter — scale + fade */
export const counterReveal: Variants = {
  hidden: { opacity: 0, scale: 0.6, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 200, damping: 16 },
  },
};

/** For hero CTA button pulse */
export const pulseGlow: Variants = {
  idle: { scale: 1, boxShadow: '0 0 0 0 rgba(255,122,42,0)' },
  hover: {
    scale: 1.04,
    boxShadow: '0 0 28px 6px rgba(255,122,42,0.45)',
    transition: { type: 'spring', stiffness: 350, damping: 18 },
  },
  tap: { scale: 0.96 },
};
