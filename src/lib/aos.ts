// AOS (Animate On Scroll) 初始化模組
// 只在客戶端載入，避免 SSR 問題
import AOS from "aos";

/**
 * 初始化 AOS 動畫。
 * 當使用者偏好「減少動態效果」(prefers-reduced-motion) 時自動停用動畫，改善無障礙體驗。
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
