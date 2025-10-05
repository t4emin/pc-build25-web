"use client";

import { CPUs, MBs, RAMs, GPUs } from "@/lib/data";
import type { CPU, Mainboard, RAM, GPU } from "@/lib/types";

type Cat = "cpu" | "ram" | "gpu" | "mb";
type Props = {
  cat: Cat;
  filters: Record<string, string[]>;
  onChange: (f: Record<string, string[]>) => void;
};

export default function CatalogSidebar({ cat, filters, onChange }: Props) {
  function toggle(group: string, value: string) {
    const current = new Set(filters[group] ?? []);
    current.has(value) ? current.delete(value) : current.add(value);
    onChange({ ...filters, [group]: Array.from(current) });
  }

  // unique helper
  const uniq = <T,>(arr: T[]) => Array.from(new Set(arr));

  if (cat === "cpu") {
    const sockets = uniq((CPUs as CPU[]).map(c => c.socket));
    const brands  = uniq((CPUs as CPU[]).map(c => c.brand));
    const gens    = uniq((CPUs as CPU[]).map(c => String(c.gen)));

    return (
      <Panel title="CPU">
        <Group title="Socket">
          {sockets.map(s => (
            <Checkbox key={s} checked={(filters["socket"] ?? []).includes(s)} label={s} onChange={() => toggle("socket", s)} />
          ))}
        </Group>
        <Group title="Brands">
          {brands.map(b => (
            <Checkbox key={b} checked={(filters["brand"] ?? []).includes(b)} label={b} onChange={() => toggle("brand", b)} />
          ))}
        </Group>
        <Group title="Gen">
          {gens.map(g => (
            <Checkbox key={g} checked={(filters["gen"] ?? []).includes(g)} label={g} onChange={() => toggle("gen", g)} />
          ))}
        </Group>
      </Panel>
    );
  }

  if (cat === "ram") {
    const types = uniq((RAMs as RAM[]).map(r => r.type));
    const sizes = uniq((RAMs as RAM[]).map(r => String(r.sizeGB)));
    return (
      <Panel title="RAM">
        <Group title="Type">
          {types.map(t => (
            <Checkbox key={t} checked={(filters["type"] ?? []).includes(t)} label={t} onChange={() => toggle("type", t)} />
          ))}
        </Group>
        <Group title="Size (GB)">
          {sizes.map(s => (
            <Checkbox key={s} checked={(filters["size"] ?? []).includes(s)} label={s} onChange={() => toggle("size", s)} />
          ))}
        </Group>
      </Panel>
    );
  }

  if (cat === "gpu") {
    const brands = uniq((GPUs as GPU[]).map(g => g.brand));
    return (
      <Panel title="GPU">
        <Group title="Brands">
          {brands.map(b => (
            <Checkbox key={b} checked={(filters["brand"] ?? []).includes(b)} label={b} onChange={() => toggle("brand", b)} />
          ))}
        </Group>
      </Panel>
    );
  }

  // mb
  const sockets = uniq((MBs as Mainboard[]).map(m => m.socket));
  const mems    = uniq((MBs as Mainboard[]).map(m => m.memoryType));
  return (
    <Panel title="Mainboard">
      <Group title="Socket">
        {sockets.map(s => (
          <Checkbox key={s} checked={(filters["socket"] ?? []).includes(s)} label={s} onChange={() => toggle("socket", s)} />
        ))}
      </Group>
      <Group title="Memory Type">
        {mems.map(m => (
          <Checkbox key={m} checked={(filters["mem"] ?? []).includes(m)} label={m} onChange={() => toggle("mem", m)} />
        ))}
      </Group>
    </Panel>
  );
}

function Panel({ title, children }: any) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-lg font-semibold">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Group({ title, children }: any) {
  return (
    <div>
      <div className="mb-2 text-sm font-medium text-gray-700">{title}</div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Checkbox({ label, checked, onChange }: { label:string; checked:boolean; onChange:()=>void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 accent-blue-600" />
      <span>{label}</span>
    </label>
  );
}