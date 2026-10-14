const nodes = document.querySelectorAll<HTMLElement>("[data-reveal]");
if (nodes.length > 0) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    nodes.forEach((node) => node.classList.add("is-in"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );
    nodes.forEach((node) => observer.observe(node));
  }
}
