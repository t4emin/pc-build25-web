"use client";
import Link from "next/link";
import { useBuildStore } from "@/lib/store";
import { checkCompatibility } from "@/lib/rules";

export default function BuildFloatingPanel({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose?: () => void;
}) {
  const { build, setPart, reset } = useBuildStore();
  const compat = checkCompatibility(build);
  const hasAny = Object.values(build).some(Boolean);

  // ไม่แสดงถ้ายังไม่เพิ่มอะไร
  if (!visible || !hasAny) return null;

  return (
    <aside
      className="
        fixed right-4 top-24 z-50 w-[320px]
        rounded-2xl border border-gray-200 bg-white shadow-2xl
        max-h-[75vh] overflow-auto p-4
        hidden md:block
      "
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">สรุปสเปค</h3>
        <button
          onClick={onClose}
          className="rounded-lg px-2 py-1 text-sm text-gray-500 hover:bg-gray-100"
          aria-label="close"
        >
          ✕
        </button>
      </div>

      <ul className="space-y-2 text-sm">
        <Row label="CPU" value={build.cpu?.model} onClear={() => setPart("cpu", undefined)} />
        <Row label="Mainboard" value={build.mainboard?.chipset} onClear={() => setPart("mainboard", undefined)} />
        <Row label="GPU" value={build.gpu?.model} onClear={() => setPart("gpu", undefined)} />
        <Row label="RAM" value={build.ram ? `${build.ram.sizeGB}GB ${build.ram.type} ${build.ram.speed}MT/s` : undefined} onClear={() => setPart("ram", undefined)} />
        <Row label="Storage" value={build.storage ? `${build.storage.type}${build.storage.gen ? " "+build.storage.gen : ""}` : undefined} onClear={() => setPart("storage", undefined)} />
        <Row label="PSU" value={build.psu ? `${build.psu.watt}W` : undefined} onClear={() => setPart("psu", undefined)} />
        <Row label="Case" value={build.case?.formSupport?.join("/")} onClear={() => setPart("case", undefined)} />
        <Row label="Cooler" value={build.cooler ? `${build.cooler.tdpSupport}W` : undefined} onClear={() => setPart("cooler", undefined)} />
      </ul>

      <div className="mt-3 space-y-2">
        {!compat.ok && (
          <div className="rounded-xl bg-red-50 p-2 text-xs text-red-700">
            {compat.errors[0]}
          </div>
        )}
        {compat.warns.length > 0 && (
          <div className="rounded-xl bg-yellow-50 p-2 text-xs text-yellow-800">
            {compat.warns[0]}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Link
          href="/build"
          className="flex-1 rounded-xl bg-blue-600 px-3 py-2 text-center text-white hover:bg-blue-700"
        >
          ไปจัดสเปค
        </Link>
        <Link
          href="/build/results"
          className="flex-1 rounded-xl border px-3 py-2 text-center hover:bg-gray-50"
        >
          คำนวณคะแนน
        </Link>
      </div>

      <button
        className="mt-3 w-full rounded-xl border px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
        onClick={() => reset()}
      >
        ล้างสเปคทั้งหมด
      </button>
    </aside>
  );
}

function Row({
  label,
  value,
  onClear,
}: {
  label: string;
  value?: string;
  onClear: () => void;
}) {
  return (
    <li className="flex items-start justify-between gap-2 rounded-lg border border-gray-100 p-2">
      <div>
        <div className="text-[11px] uppercase tracking-wide text-gray-500">{label}</div>
        <div className="text-[13px]">{value ?? <span className="text-gray-400">—</span>}</div>
      </div>
      {value && (
        <button
          onClick={onClear}
          className="rounded-md px-2 py-1 text-xs text-gray-500 hover:bg-gray-100"
          aria-label={`clear ${label}`}
        >
          ลบ
        </button>
      )}
    </li>
  );
}