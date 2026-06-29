// 在頁面繪製前同步套用深淺色主題，避免深色偏好使用者看到淺色閃爍（FOUC）。
// 此檔以阻塞式 <script src> 於 <head> 載入，須在 body 繪製前執行。
(function () {
  try {
    var saved = localStorage.getItem("theme");
    var prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    var dark = saved === "dark" || (!saved && prefersDark);
    document.documentElement.classList.toggle("dark", dark);
  } catch (e) {
    /* localStorage / matchMedia 不可用時靜默略過，維持預設淺色 */
  }
})();
