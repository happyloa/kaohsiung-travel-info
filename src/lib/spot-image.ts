import { spotWidths } from "#lib/media.json";

// 檔名格式與 scripts/optimize-images.mjs 一致。
export function spotImageSrc(id: string) {
  return `/images/spots/${id}-${spotWidths[0]}.webp`;
}

export function spotImageSrcset(id: string, format: "avif" | "webp") {
  return spotWidths.map((width) => `/images/spots/${id}-${width}.${format} ${width}w`).join(", ");
}
