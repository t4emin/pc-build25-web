"use client";

type TabId = "cpu" | "gpu" | "ram" | "mb" | "psu";

export default function CategoryTabs({
  active,
  onChange,
  className = "",
}: {
  active: TabId;
  onChange: (v: TabId) => void;
  className?: string;
}) {
  const tabs: { id: TabId; label: string }[] = [
    { id: "cpu", label: "CPU" },
    { id: "gpu", label: "GPU" },
    { id: "ram", label: "RAM" },
    { id: "mb",  label: "Mainboard" },
    { id: "psu", label: "PSU" },
  ];

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {tabs.map(t => {
        const activeCls =
          t.id === active
            ? "bg-pink-600 text-white shadow"
            : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300";
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`rounded-xl border px-3 py-2 text-sm transition ${activeCls}`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}