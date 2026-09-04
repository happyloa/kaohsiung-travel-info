import AOS from "aos";

/**
 * 在元件掛載後初始化動畫；使用者偏好減少動態效果時完全停用。
 */
export function initAOS() {
  AOS.init({
    duration: 600,
    easing: "ease-out-cubic",
    once: true,
    offset: 50,
    disable: () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  });
}
