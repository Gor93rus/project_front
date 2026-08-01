import { motion } from 'framer-motion';
import type { Variants, Transition } from 'framer-motion';
import type { ReactNode } from 'react';
import { fadeUp } from '../lib/animations';

interface Props {
  children: ReactNode;
  variants?: Variants;
  transition?: Transition;
  delay?: number;
  once?: boolean;
  margin?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AnimatedSection({
  children,
  variants = fadeUp,
  transition,
  delay,
  once = true,
  // Extend the intersection root well past the bottom of the viewport so
  // sections reveal reliably even when the page never receives a real
  // scroll gesture (devtools viewport resize, fast navigation, prerender,
  // etc.) — without this, whileInView could leave content stuck at
  // opacity:0 ("hidden") whenever the element never crosses into view via
  // an actual scroll event.
  margin = '0px 0px 1200px 0px',
  className,
  style,
}: Props) {
  const resolvedTransition: Transition | undefined =
    delay !== undefined
      ? { delay, ...(transition ?? {}) }
      : transition;
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin }}
      variants={variants}
      transition={resolvedTransition}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
