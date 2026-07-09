import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export default function PageMotion({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div style={{ width: "100%", minWidth: 0 }}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{
        duration: 0.22,
        ease: [0.22, 0.61, 0.36, 1],
      }}
      style={{ width: "100%", minWidth: 0, willChange: "transform, opacity", backfaceVisibility: "hidden" }}
    >
      {children}
    </motion.div>
  );
}
