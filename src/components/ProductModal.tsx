"use client";
import { useEffect } from "react";

export default function ProductModal({
  open,
  onClose,
  product
}: {
  open: boolean;
  onClose: () => void;
  product?: any;
}) {
  useEffect(() => {
    function esc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [open]);

  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1 text-gray-500 hover:bg-gray-100"
        >
          ✕
        </button>

        <div className="aspect-[4/3] w-full bg-gray-200" />
        <div className="p-6">
          <h2 className="text-xl font-semibold">{product.model ?? product.id}</h2>
          {product.brand && (
            <div className="mt-1 text-sm text-gray-600">{product.brand}</div>
          )}

          {/* ส่วนรายละเอียด mock ไว้คร่าวๆ */}
          <div className="mt-4 space-y-2 text-sm text-gray-700">
            {product.socket && <div>Socket: {product.socket}</div>}
            {product.gen && <div>Gen: {product.gen}</div>}
            {product.tgp && <div>GPU TGP: {product.tgp} W</div>}
            {product.sizeGB && <div>RAM: {product.sizeGB} GB</div>}
          </div>

          <div className="mt-6 text-right">
            <button
              onClick={() => {
                onClose();
              }}
              className="rounded-xl border px-4 py-2 hover:bg-gray-50"
            >
              ปิด
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}