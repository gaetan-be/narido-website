type NavigatorHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

/** Static mark on small screens, reduced motion, and low-power devices. */
export function shouldUseStaticHero(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  if (window.matchMedia("(max-width: 1023px)").matches) return true;

  const nav = navigator as NavigatorHints;
  if (nav.connection?.saveData) return true;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory > 0 && nav.deviceMemory <= 2) {
    return true;
  }
  if (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 2) return true;
  return false;
}
