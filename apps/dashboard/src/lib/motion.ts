export const panelSequence = {
  animate: { transition: { staggerChildren: 0.04 } },
};

export const panelFade = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.12, ease: "easeOut" },
  },
};

export const ledgerContainer = {
  animate: { transition: { staggerChildren: 0.06 } },
};

export const ledgerRow = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

export const findingCard = ledgerRow;

export const verdictRail = {
  initial: { width: "0%" },
  animate: {
    width: "100%",
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export const verdictContent = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.12, delay: 0.12, ease: "easeOut" },
  },
};

export const telemetryFade = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.08, ease: "easeOut" },
  },
};
