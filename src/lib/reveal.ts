import type { Attachment } from "svelte/attachments";

const transforms = {
  up: "translateY(100px)",
  down: "translateY(-100px)",
  zoom: "scale(0.6)",
};

export function reveal(
  effect: keyof typeof transforms = "up",
  delay = 0,
): Attachment<HTMLElement> {
  return (element) => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches || !("IntersectionObserver" in window)) return;

    let animation: Animation | undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        if (reducedMotion.matches) return;

        animation = element.animate(
          [
            { opacity: 0, transform: transforms[effect] },
            { opacity: 1, transform: "none" },
          ],
          {
            duration: 600,
            easing: "cubic-bezier(0.215, 0.61, 0.355, 1)",
            delay,
            fill: "backwards",
          },
        );
      },
      { rootMargin: "0px 0px -50px 0px" },
    );

    const stopForReducedMotion = () => {
      if (!reducedMotion.matches) return;
      observer.disconnect();
      animation?.cancel();
    };

    // 內容預設可見；動畫只在進入畫面時播放一次。
    observer.observe(element);
    reducedMotion.addEventListener("change", stopForReducedMotion);

    return () => {
      observer.disconnect();
      animation?.cancel();
      reducedMotion.removeEventListener("change", stopForReducedMotion);
    };
  };
}
