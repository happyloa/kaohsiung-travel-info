// 在頁面繪製前同步套用深淺色主題，避免深色偏好使用者看到淺色閃爍（FOUC）。
// 此檔以阻塞式 <script src> 於 <head> 載入，須在 body 繪製前執行。
(function () {
  var saved = null;
  try {
    saved = localStorage.getItem("theme");
  } catch {
    /* 儲存空間不可用時，仍依照系統偏好套用主題。 */
  }
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  var dark = saved === "dark" || (saved !== "light" && prefersDark);
  document.documentElement.classList.toggle("dark", dark);
})();
