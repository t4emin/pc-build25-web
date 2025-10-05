// src/app/admin/affiliates/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import type { AffiliateItem, AffiliateCategory } from "@/lib/affiliate-types";

type FormState = Partial<AffiliateItem>;

export default function AdminAffiliatesPage() {
  const [items, setItems] = useState<AffiliateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ฟอร์มเพิ่มรายการใหม่ (ค่าเริ่มต้นเป็น GPU)
  const [form, setForm] = useState<FormState>({
    category: "gpu",
    title: "",
    url: "",
    brand: "",
    model: "",
    image: "",
    images: [],
    price: undefined,
    // เสริมสำหรับแต่ละหมวด:
    // cpu: socket, gen, tdp
    // gpu: tgp, connectors
    // ram: memoryType, sizeGB, speed
    // mb : socket, memoryType, speed(=memoryMaxSpeed)
    // psu: watt, connectors
  });

  // โหลดรายการทั้งหมด
  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/affiliates");
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "load failed");
      setItems(data.items || []);
    } catch (e: any) {
      setError(e.message || "load error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // สร้าง/เพิ่มรายการ
  async function add() {
    setSaving(true);
    setError(null);
    try {
      const payload: any = { ...form };
      // แปลง images (input แบบ comma-separated) ให้เป็น array
      if (typeof payload.images === "string") {
        payload.images = (payload.images as string)
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean);
      }
      // ถ้าใส่ image หลักแต่ยังไม่ได้ใส่ images → ใช้ image เป็นตัวแรก
      if ((!payload.images || payload.images.length === 0) && payload.image) {
        payload.images = [payload.image];
      }

      const res = await fetch("/api/affiliates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "create failed");

      // reset บางฟิลด์
      setForm((f) => ({
        category: f.category || "gpu",
        title: "",
        url: "",
        brand: "",
        model: "",
        image: "",
        images: [],
        price: undefined,
        socket: undefined,
        gen: undefined,
        tdp: undefined,
        tgp: undefined,
        memoryType: undefined,
        sizeGB: undefined,
        speed: undefined,
        watt: undefined,
        connectors: undefined,
      }));

      await load();
    } catch (e: any) {
      setError(e.message || "create error");
    } finally {
      setSaving(false);
    }
  }

  // ลบรายการ
  async function remove(id: string) {
    if (!confirm("ลบรายการนี้?")) return;
    setError(null);
    const res = await fetch(`/api/affiliates/${id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data?.error || "ลบไม่สำเร็จ");
      return;
    }
    await load();
  }

  // UI helper
  const categoryLabel: Record<AffiliateCategory, string> = {
    cpu: "CPU",
    gpu: "GPU",
    ram: "RAM",
    mb: "Mainboard",
    psu: "PSU",
  };

  const listByCat = useMemo(() => {
    const groups: Record<AffiliateCategory, AffiliateItem[]> = {
      cpu: [],
      gpu: [],
      ram: [],
      mb: [],
      psu: [],
    };
    for (const it of items) groups[it.category].push(it);
    return groups;
  }, [items]);

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Affiliate Admin</h1>

      {/* สถานะ/ข้อผิดพลาด */}
      {error && (
        <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ฟอร์มเพิ่มรายการ */}
      <section className="rounded-2xl border bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">เพิ่มรายการ</h2>

        <div className="grid gap-3 md:grid-cols-2">
          {/* category */}
          <select
            className="rounded-lg border px-3 py-2"
            value={form.category as string}
            onChange={(e) =>
              setForm((f) => ({ ...f, category: e.target.value as AffiliateCategory }))
            }
          >
            <option value="gpu">GPU</option>
            <option value="cpu">CPU</option>
            <option value="ram">RAM</option>
            <option value="mb">Mainboard</option>
            <option value="psu">PSU</option>
          </select>

          {/* title */}
          <input
            className="rounded-lg border px-3 py-2"
            placeholder="Title (เช่น RX 7800 XT / Ryzen 5 7600 / RM750e)"
            value={form.title || ""}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />

          {/* url */}
          <input
            className="rounded-lg border px-3 py-2"
            placeholder="Affiliate URL (เช่น https://s.shopee.co.th/...)"
            value={form.url || ""}
            onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
          />

          {/* brand */}
          <input
            className="rounded-lg border px-3 py-2"
            placeholder="Brand (AMD / NVIDIA / Intel / Corsair ...)"
            value={form.brand || ""}
            onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
          />

          {/* model */}
          <input
            className="rounded-lg border px-3 py-2"
            placeholder="Model (เช่น RX 7800 XT, RM750e)"
            value={form.model || ""}
            onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
          />

          {/* image (หลัก) */}
          <input
            className="rounded-lg border px-3 py-2"
            placeholder="Image URL (ภาพหลัก - ไม่บังคับ)"
            value={form.image || ""}
            onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
          />

          {/* images (หลายภาพ) */}
          <input
            className="rounded-lg border px-3 py-2"
            placeholder="Images (คั่นด้วย , )"
            value={
              Array.isArray(form.images)
                ? (form.images as string[]).join(",")
                : (form.images as any) || ""
            }
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                images: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              }))
            }
          />

          {/* price */}
          <input
            className="rounded-lg border px-3 py-2"
            placeholder="Price (ตัวเลข)"
            type="number"
            value={(form.price as any) ?? ""}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                price: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
          />
        </div>

        {/* ฟิลด์เฉพาะหมวด */}
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {/* CPU */}
          {form.category === "cpu" && (
            <>
              <input
                className="rounded-lg border px-3 py-2"
                placeholder="Socket (AM5/LGA1700)"
                value={(form.socket as any) || ""}
                onChange={(e) => setForm((f) => ({ ...f, socket: e.target.value as any }))}
              />
              <input
                className="rounded-lg border px-3 py-2"
                placeholder="Gen (ตัวเลข)"
                type="number"
                value={(form.gen as any) ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, gen: e.target.value ? Number(e.target.value) : undefined }))
                }
              />
              <input
                className="rounded-lg border px-3 py-2"
                placeholder="TDP (W)"
                type="number"
                value={(form.tdp as any) ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tdp: e.target.value ? Number(e.target.value) : undefined }))
                }
              />
            </>
          )}

          {/* GPU */}
          {form.category === "gpu" && (
            <>
              <input
                className="rounded-lg border px-3 py-2"
                placeholder="TGP (W)"
                type="number"
                value={(form.tgp as any) ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tgp: e.target.value ? Number(e.target.value) : undefined }))
                }
              />
              <input
                className="rounded-lg border px-3 py-2"
                placeholder="Connectors (คั่นด้วย , ) เช่น 8pin,8pin"
                value={
                  Array.isArray(form.connectors)
                    ? (form.connectors as string[]).join(",")
                    : (form.connectors as any) || ""
                }
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    connectors: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  }))
                }
              />
            </>
          )}

          {/* RAM */}
          {form.category === "ram" && (
            <>
              <input
                className="rounded-lg border px-3 py-2"
                placeholder="Memory Type (DDR4/DDR5)"
                value={(form.memoryType as any) || ""}
                onChange={(e) => setForm((f) => ({ ...f, memoryType: e.target.value as any }))}
              />
              <input
                className="rounded-lg border px-3 py-2"
                placeholder="Size (GB)"
                type="number"
                value={(form.sizeGB as any) ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sizeGB: e.target.value ? Number(e.target.value) : undefined }))
                }
              />
              <input
                className="rounded-lg border px-3 py-2"
                placeholder="Speed (MT/s)"
                type="number"
                value={(form.speed as any) ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, speed: e.target.value ? Number(e.target.value) : undefined }))
                }
              />
            </>
          )}

          {/* Mainboard */}
          {form.category === "mb" && (
            <>
              <input
                className="rounded-lg border px-3 py-2"
                placeholder="Socket (AM5/LGA1700)"
                value={(form.socket as any) || ""}
                onChange={(e) => setForm((f) => ({ ...f, socket: e.target.value as any }))}
              />
              <input
                className="rounded-lg border px-3 py-2"
                placeholder="Memory Type (DDR4/DDR5)"
                value={(form.memoryType as any) || ""}
                onChange={(e) => setForm((f) => ({ ...f, memoryType: e.target.value as any }))}
              />
              <input
                className="rounded-lg border px-3 py-2"
                placeholder="Memory Max Speed (MT/s)"
                type="number"
                value={(form.speed as any) ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, speed: e.target.value ? Number(e.target.value) : undefined }))
                }
              />
            </>
          )}

          {/* PSU */}
          {form.category === "psu" && (
            <>
              <input
                className="rounded-lg border px-3 py-2"
                placeholder="Watt (เช่น 750)"
                type="number"
                value={(form.watt as any) ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, watt: e.target.value ? Number(e.target.value) : undefined }))
                }
              />
              <input
                className="rounded-lg border px-3 py-2"
                placeholder="Connectors (คั่นด้วย , ) เช่น 24pin,8pin,8pin"
                value={
                  Array.isArray(form.connectors)
                    ? (form.connectors as string[]).join(",")
                    : (form.connectors as any) || ""
                }
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    connectors: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  }))
                }
              />
            </>
          )}
        </div>

        <button
          className="mt-3 rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
          onClick={add}
          disabled={saving}
        >
          {saving ? "กำลังบันทึก..." : "เพิ่มรายการ"}
        </button>
      </section>

      {/* รายการทั้งหมด แยกกลุ่มตามหมวด */}
      <section className="mt-6 space-y-8">
        {(Object.keys(listByCat) as AffiliateCategory[]).map((c) => (
          <div key={c}>
            <h3 className="mb-3 text-lg font-semibold">{categoryLabel[c]}</h3>
            {listByCat[c].length === 0 ? (
              <div className="rounded-xl border border-dashed p-6 text-center text-gray-500">
                ยังไม่มีรายการในหมวดนี้
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {listByCat[c].map((it) => (
                  <div key={it.id} className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                    {/* แกลเลอรีเล็ก ๆ: โชว์ภาพแรก + แถว thumbnails */}
                    <div className="w-full">
                      <div
                        className="aspect-[4/3] w-full"
                        style={{
                          background: it.images?.[0]
                            ? `center/cover no-repeat url("${it.images[0]}")`
                            : it.image
                            ? `center/cover no-repeat url("${it.image}")`
                            : undefined,
                        }}
                      >
                        {!it.images?.[0] && !it.image && <div className="h-full w-full bg-gray-200" />}
                      </div>
                      {it.images && it.images.length > 1 && (
                        <div className="flex items-center gap-2 overflow-auto p-2">
                          {it.images.map((src, i) => (
                            <div
                              key={i}
                              className="h-12 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200"
                              style={{ background: src ? `center/cover no-repeat url("${src}")` : undefined }}
                            >
                              {!src && <div className="h-full w-full bg-gray-200" />}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="text-sm text-blue-700">{categoryLabel[it.category]}</div>
                      <a
                        href={it.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mb-1 block text-[16px] font-semibold hover:underline"
                      >
                        {it.title}
                      </a>
                      <div className="text-sm text-gray-600">
                        {[it.brand, it.model].filter(Boolean).join(" • ")}
                      </div>

                      {/* บรรทัดรายละเอียดสั้น ๆ ตามหมวด */}
                      <div className="mt-2 text-xs text-gray-600">
                        {it.category === "cpu" && (
                          <span>{[it.socket && `Socket ${it.socket}`, it.gen && `Gen ${it.gen}`, it.tdp && `${it.tdp}W`].filter(Boolean).join(" • ")}</span>
                        )}
                        {it.category === "gpu" && (
                          <span>{[it.tgp && `${it.tgp}W`, it.connectors?.length && `${it.connectors?.join("/")}`].filter(Boolean).join(" • ")}</span>
                        )}
                        {it.category === "ram" && (
                          <span>{[it.memoryType, it.sizeGB && `${it.sizeGB}GB`, it.speed && `${it.speed}MT/s`].filter(Boolean).join(" • ")}</span>
                        )}
                        {it.category === "mb" && (
                          <span>{[it.socket, it.memoryType, it.speed && `Max ${it.speed}MT/s`].filter(Boolean).join(" • ")}</span>
                        )}
                        {it.category === "psu" && (
                          <span>{[it.watt && `${it.watt}W`, it.connectors?.length && it.connectors.join("/")].filter(Boolean).join(" • ")}</span>
                        )}
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-blue-700">{it.price ? `฿${it.price.toLocaleString()}` : "฿—"}</div>
                        <button
                          className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50"
                          onClick={() => remove(it.id)}
                        >
                          ลบ
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </section>
    </main>
  );
}