import type { Variants } from "framer-motion";

export const cardHover: Variants = {
  rest: { scale: 1, boxShadow: "2px 2px 0px rgba(0,0,0,0.3)" },
  hover: { scale: 1.02, boxShadow: "4px 4px 0px rgba(0,0,0,0.4)" },
};

export const particleBurst = (count: number) => ({
  initial: { scale: 0, opacity: 1 },
  animate: (i: number) => {
    const angle = (i / count) * Math.PI * 2;
    const distance = 30 + Math.random() * 20;
    return {
      scale: [0, 1.5, 0],
      opacity: [1, 1, 0],
      x: [0, Math.cos(angle) * distance],
      y: [0, Math.sin(angle) * distance],
      transition: { duration: 0.5, ease: "easeOut" as const },
    };
  },
});

export const pageSlideIn: Variants = {
  initial: { x: "100%", opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", damping: 25, stiffness: 200 },
  },
  exit: { x: "-30%", opacity: 0, transition: { duration: 0.2 } },
};

export const staggerContainer: Variants = {
  animate: { transition: { staggerChildren: 0.05 } },
};

export const fadeInUp: Variants = {
  initial: { y: 20, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", damping: 20 },
  },
};

export const scaleIn: Variants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", damping: 20, stiffness: 300 },
  },
};
