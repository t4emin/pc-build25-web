"use client";
import { useState } from "react";

export default function CatalogCard({
  title, subtitle, onAdd, href, image, images, price,
}: {
  title: string;
  subtitle?: string;
  onAdd?: () => void;
  href?: string;
  image?: string;
  images?: string[];        // ✅ รูปหลายภาพ
  price?: number | null;
}) {
  const gallery = (images && images.length > 0) ? images : (image ? [image] : []);
  const [idx, setIdx] = useState(0);

  const ImgBlock = (
    <div className="w-full">
      <div
        className="aspect-[4/3] w-full rounded-b-none"
        style={{ background: gallery[idx] ? `center/cover no-repeat url("${gallery[idx]}")` : undefined }}
      >
        {!gallery[idx] && <div className="h-full w-full bg-gray-200" />}
      </div>

      {gallery.length > 1 && (
        <div className="flex items-center gap-2 overflow-auto p-2">
          {gallery.map((src, i) => (
            <button
              key={i}
              onClick={(e) => { e.preventDefault(); setIdx(i); }}
              className={`h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg border ${i===idx ? "border-pink-500" : "border-gray-200"}`}
              style={{ background: src ? `center/cover no-repeat url("${src}")` : undefined }}
              aria-label={`image ${i+1}`}
              title={`image ${i+1}`}
            >
              {!src && <div className="h-full w-full bg-gray-200" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const cardHeader = href ? (
    <a href={href} target="_blank" rel="noopener noreferrer">{ImgBlock}</a>
  ) : ImgBlock;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {cardHeader}
      <div className="p-4">
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="mb-1 block text-[16px] font-semibold hover:underline">
            {title}
          </a>
        ) : (
          <h4 className="mb-1 text-[16px] font-semibold">{title}</h4>
        )}
        {subtitle && <div className="mb-3 text-sm text-gray-600">{subtitle}</div>}
        <div className="flex items-center justify-between">
          <div className="text-blue-700">{price ? `฿${price.toLocaleString()}` : "฿—"}</div>
          <button onClick={onAdd} className="rounded-xl border px-3 py-2 text-sm transition hover:bg-gray-50">
            เพิ่มไปยังสเปค
          </button>
        </div>
      </div>
    </div>
  );
}