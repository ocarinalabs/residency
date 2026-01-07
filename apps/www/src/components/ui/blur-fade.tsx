"use client";

import {
  AnimatePresence,
  motion,
  type UseInViewOptions,
  useInView,
  type Variants,
} from "framer-motion";
import { useRef } from "react";

const ANIMATION = {
  DURATION: 0.4,
  Y_OFFSET: 6,
  IN_VIEW_MARGIN: "-50px",
  BLUR_AMOUNT: "6px",
  INITIAL_DELAY: 0.04,
} as const;

type MarginType = UseInViewOptions["margin"];

type BlurFadeProps = {
  children: React.ReactNode;
  className?: string;
  variant?: {
    hidden: { y: number };
    visible: { y: number };
  };
  duration?: number;
  delay?: number;
  yOffset?: number;
  inView?: boolean;
  inViewMargin?: MarginType;
  blur?: string;
};

export function BlurFade({
  children,
  className,
  variant,
  duration = ANIMATION.DURATION,
  delay = 0,
  yOffset = ANIMATION.Y_OFFSET,
  inView = false,
  inViewMargin = ANIMATION.IN_VIEW_MARGIN,
  blur = ANIMATION.BLUR_AMOUNT,
}: BlurFadeProps) {
  const ref = useRef(null);
  const inViewResult = useInView(ref, { once: true, margin: inViewMargin });
  const defaultVariants: Variants = {
    hidden: { y: yOffset, opacity: 0, filter: `blur(${blur})` },
    visible: { y: -yOffset, opacity: 1, filter: "blur(0px)" },
  };
  return (
    <AnimatePresence>
      <motion.div
        animate={!inView || inViewResult ? "visible" : "hidden"}
        className={className}
        exit="hidden"
        initial="hidden"
        ref={ref}
        transition={{
          delay: ANIMATION.INITIAL_DELAY + delay,
          duration,
          ease: "easeOut",
        }}
        variants={variant || defaultVariants}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
