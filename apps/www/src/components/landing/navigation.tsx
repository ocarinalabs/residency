"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  type Variants,
} from "framer-motion";
import { type MouseEvent, useRef, useState } from "react";
import { Logo } from "@/components/logo";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "register", href: "/register" },
  { name: "house", href: "/guide" },
  {
    name: "instagram",
    href: "https://www.instagram.com/aitakeover.co/",
    external: true,
  },
];

const EXPAND_SCROLL_THRESHOLD = 80;

const containerVariants: Variants = {
  expanded: {
    y: 0,
    opacity: 1,
    width: "auto",
    transition: {
      y: { type: "spring", damping: 18, stiffness: 250 },
      opacity: { duration: 0.3 },
      type: "spring",
      damping: 20,
      stiffness: 300,
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
  collapsed: {
    y: 0,
    opacity: 1,
    width: "3rem",
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300,
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const logoVariants: Variants = {
  expanded: {
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: { type: "spring", damping: 15 },
  },
  collapsed: {
    opacity: 0,
    x: -25,
    rotate: -180,
    transition: { duration: 0.3 },
  },
};

const itemVariants: Variants = {
  expanded: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: "spring", damping: 15 },
  },
  collapsed: { opacity: 0, x: -20, scale: 0.95, transition: { duration: 0.2 } },
};

const collapsedIconVariants: Variants = {
  expanded: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  collapsed: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 300,
      delay: 0.15,
    },
  },
};

export function AnimatedNavigation() {
  const [isExpanded, setExpanded] = useState(true);

  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);
  const scrollPositionOnCollapse = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;

    if (isExpanded && latest > previous && latest > 150) {
      setExpanded(false);
      scrollPositionOnCollapse.current = latest;
    } else if (
      !isExpanded &&
      latest < previous &&
      scrollPositionOnCollapse.current - latest > EXPAND_SCROLL_THRESHOLD
    ) {
      setExpanded(true);
    }

    lastScrollY.current = latest;
  });

  const handleNavClick = (e: MouseEvent) => {
    if (!isExpanded) {
      e.preventDefault();
      setExpanded(true);
    }
  };

  return (
    <div className="fixed top-6 left-1/2 z-50 -translate-x-1/2">
      <motion.nav
        animate={isExpanded ? "expanded" : "collapsed"}
        className={cn(
          "flex h-12 items-center overflow-hidden rounded-full border bg-background/80 shadow-lg backdrop-blur-sm",
          !isExpanded && "cursor-pointer justify-center"
        )}
        initial={{ y: -80, opacity: 0 }}
        onClick={handleNavClick}
        variants={containerVariants}
        whileHover={isExpanded ? {} : { scale: 1.1 }}
        whileTap={isExpanded ? {} : { scale: 0.95 }}
      >
        <motion.div
          className="hidden flex-shrink-0 items-center pr-1 pl-2 font-semibold sm:flex sm:pr-2 sm:pl-4"
          variants={logoVariants}
        >
          <Logo className="h-6 w-auto" />
        </motion.div>

        <motion.div
          className={cn(
            "flex items-center gap-4 pr-2 pl-2 sm:gap-4 sm:pr-4 sm:pl-0",
            !isExpanded && "pointer-events-none"
          )}
        >
          {navItems.map((item) => (
            <motion.a
              className="px-1 py-1 font-medium font-sans text-muted-foreground text-sm transition-colors hover:text-foreground sm:px-2"
              href={item.href}
              key={item.name}
              onClick={(e) => e.stopPropagation()}
              rel={item.external ? "noopener noreferrer" : undefined}
              target={item.external ? "_blank" : undefined}
              variants={itemVariants}
            >
              {item.name}
            </motion.a>
          ))}
          <motion.a
            className="px-1 py-1 font-medium font-sans text-muted-foreground text-sm transition-colors hover:text-foreground sm:px-2"
            href="https://faw.dev"
            onClick={(e) => e.stopPropagation()}
            rel="noopener noreferrer"
            target="_blank"
            variants={itemVariants}
          >
            faw
          </motion.a>
          <motion.div variants={itemVariants}>
            <ModeToggle />
          </motion.div>
        </motion.div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={isExpanded ? "expanded" : "collapsed"}
            variants={collapsedIconVariants}
          >
            <Logo className="h-8 w-8" />
          </motion.div>
        </div>
      </motion.nav>
    </div>
  );
}
