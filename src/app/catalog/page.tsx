"use client";

import { useEffect, useMemo, useState } from "react";
import CatalogSidebar from "@/components/CatalogSidebar";
import CatalogCard from "@/components/CatalogCard";
import BuildFloatingPanel from "@/components/BuildFloatingPanel";
import CategoryTabs from "@/components/CategoryTabs";
import { useBuildStore } from "@/lib/store";
import type { AffiliateItem, AffiliateCategory } from "@/lib/affiliate-types";
import { toChipset } from "@/lib/type-guards";

type Category = AffiliateCategory; // "cpu" | "gpu" | "ram" | "mb" | "psu"

export default function CatalogPage() {
  const [cat, setCat] = useState<Category>("cpu");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [showPanel, setShowPanel] = useState(false);

  const [loading, setLoading] = useState(false);
  const [affItems, setAffItems] = useState<AffiliateItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // โหลดสินค้าจาก API ตามหมวด + คำค้น
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true); setError(null);
      try {
        const url = `/api/affiliates?cat=${cat}&q=${encodeURIComponent(search)}`;
        const res = await fetch(url);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Fetch failed");
        if (!cancelled) setAffItems(data.items || []);
      } catch (e: any) {
        if (!cancelled) setError(e.message || "Fetch error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [cat, search]);

  const { setPart } = useBuildStore();

  function handleAddFromAffiliate(item: AffiliateItem) {
    if (item.category === "gpu") {
      setPart("gpu", {
        id: item.id,
        brand: (item.brand as any) || "NVIDIA",
        model: item.model || item.title,
        tgp: item.tgp ?? 250,
        score: 750,
        connectors: item.connectors ?? ["8pin"],
      });
    } else if (item.category === "cpu") {
      setPart("cpu", {
        id: item.id,
        brand: (item.brand as any) || "AMD",
        model: item.model || item.title,
        gen: item.gen ?? 7,
        socket: (item.socket as any) || "AM5",
        tdp: item.tdp ?? 105,
        score: 650,
      });
    } else if (item.category === "ram") {
      setPart("ram", {
        id: item.id,
        type: (item.memoryType as any) || "DDR5",
        sizeGB: item.sizeGB ?? 32,
        speed: item.speed ?? 6000,
      });
    } else if (item.category === "mb") {
      const chipset = toChipset(item.model) ?? "B650";
      setPart("mainboard", {
        id: item.id,
        socket: (item.socket as any) || "AM5",
        chipset,
        memoryType: (item.memoryType as any) || "DDR5",
        memoryMaxSpeed: item.speed ?? 6000,
        formFactor: "ATX",
      });
    } else if (item.category === "psu") {
      setPart("psu", {
        id: item.id,
        watt: item.watt ?? 750,
        connectors: item.connectors ?? ["24pin", "8pin", "8pin"],
      } as any);
    }
    setShowPanel(true);
  }

  // กรองฝั่ง client ตามตัวเลือกจาก Sidebar
  const filtered = useMemo(() => {
    return affItems.filter((it) => {
      if (cat === "gpu") {
        const brands = filters["brand"] ?? [];
        const models = filters["model"] ?? [];
        const okBrand = brands.length ? (it.brand ? brands.includes(it.brand) : false) : true;
        const okModel = models.length ? (it.model ? models.includes(it.model) : false) : true;
        return okBrand && okModel;
      }
      if (cat === "cpu") {
        const sockets = filters["socket"] ?? [];
        const brands  = filters["brand"] ?? [];
        const gens    = filters["gen"] ?? [];
        const okSock  = sockets.length ? (it.socket ? sockets.includes(it.socket) : false) : true;
        const okBrand = brands.length  ? (it.brand ? brands.includes(it.brand) : false) : true;
        const okGen   = gens.length    ? (it.gen ? gens.includes(String(it.gen)) : false) : true;
        return okSock && okBrand && okGen;
      }
      if (cat === "ram") {
        const types = filters["type"] ?? [];
        const sizes = filters["size"] ?? [];
        const okType = types.length ? (it.memoryType ? types.includes(it.memoryType) : false) : true;
        const okSize = sizes.length ? (it.sizeGB ? sizes.includes(String(it.sizeGB)) : false) : true;
        return okType && okSize;
      }
      if (cat === "mb") {
        const sockets = filters["socket"] ?? [];
        const mems    = filters["mem"] ?? [];
        const okSock = sockets.length ? (it.socket ? sockets.includes(it.socket) : false) : true;
        const okMem  = mems.length    ? (it.memoryType ? mems.includes(it.memoryType) : false) : true;
        return okSock && okMem;
      }
      return true; // psu
    });
  }, [affItems, filters, cat]);

  function subtitleOf(it: AffiliateItem) {
    if (cat === "gpu") return [it.brand, it.model].filter(Boolean).join(" • ");
    if (cat === "cpu") return [it.brand, it.socket && `Socket ${it.socket}`, it.gen && `Gen ${it.gen}`].filter(Boolean).join(" • ");
    if (cat === "ram") return [it.memoryType, it.sizeGB && `${it.sizeGB}GB`, it.speed && `${it.speed}MT/s`].filter(Boolean).join(" • ");
    if (cat === "mb")  return [it.brand, it.model, it.socket, it.memoryType].filter(Boolean).join(" • ");
    if (cat === "psu") return [it.brand, it.model, it.watt && `${it.watt}W`, it.connectors?.join("/")].filter(Boolean).join(" • ");
    return "";
  }

  return (
    <main className="mx-auto max-w-6xl p-4 md:p-6">
      {/* แท็บหมวดอุปกรณ์ + ช่องค้นหา */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <CategoryTabs
          active={cat}
          onChange={(v) => { setCat(v as Category); setFilters({}); }}
          className="flex-1"
        />
        <input
          className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:w-80"
          placeholder="ค้นหา (เช่น 7800X3D, 4070, B650, DDR5, 750W)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-12">
        <aside className="md:col-span-3">
          <div className="sticky top-4">
            <CatalogSidebar cat={cat} filters={filters} onChange={setFilters} />
          </div>
        </aside>

        <section className="md:col-span-9">
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              ดึงข้อมูลไม่สำเร็จ: {error}
            </div>
          )}
          {loading ? (
            <div className="rounded-xl border border-dashed p-8 text-center text-gray-500">
              กำลังโหลด…
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center text-gray-500">
              ไม่พบรายการตามเงื่อนไขที่เลือก
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((it) => (
                <CatalogCard
                  key={it.id}
                  title={it.title}
                  subtitle={subtitleOf(it)}
                  href={it.url}          // ลิงก์ affiliate
                  image={it.image}
                  images={it.images}     // หลายภาพ
                  price={it.price ?? undefined}
                  onAdd={() => handleAddFromAffiliate(it)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <BuildFloatingPanel visible={showPanel} onClose={() => setShowPanel(false)} />
    </main>
  );
}