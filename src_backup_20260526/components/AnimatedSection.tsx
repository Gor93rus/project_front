import { motion } from 'framer-motion';
import type { Variants, Transition } from 'framer-motion';
import type { ReactNode } from 'react';
import { fadeUp } from '../lib/animations';

interface Props {
  children: ReactNode;
  variants?: Variants;
  transition?: Transition;
  once?: boolean;
  margin?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AnimatedSection({
  children,
  variants = fadeUp,
  transition,
  once = true,
  margin = '-40px',
  className,
  style,
}: Props) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin }}
      variants={variants}
      transition={transition}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
