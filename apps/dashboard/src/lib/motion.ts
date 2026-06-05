export const ledgerContainer = {
  animate: { transition: { staggerChildren: 0.06 } },
};

export const ledgerRow = {
  initial: { opacity: 0, x: -10, filter: "blur(3px)" },
  animate: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.28, ease: "easeOut" },
  },
};

export const findingCard = {
  initial: { opacity: 0, y: 10, scale: 0.99 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.26, ease: [0.16, 1, 0.3, 1] },
  },
};

export const verdictStamp = {
  initial: { opacity: 0, scale: 0.96 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 520, damping: 30 },
  },
};
