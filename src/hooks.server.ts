import type { Handle } from "@sveltejs/kit";

const securityHeaders: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "no-referrer",
  // 移除 HSTS preload（對靜態 / 預覽站台是過度承諾，須先確認所有子網域皆支援 HTTPS）
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains",
  // 關閉本站不使用的瀏覽器功能，縮小受攻擊面
  "Permissions-Policy": "geolocation=(), camera=(), microphone=(), payment=(), usb=()",
};

export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);

  for (const [header, value] of Object.entries(securityHeaders)) {
    response.headers.set(header, value);
  }

  return response;
};
