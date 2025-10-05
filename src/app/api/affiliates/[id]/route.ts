// src/app/api/affiliates/[id]/route.ts
import { NextResponse } from "next/server";
import { loadAffiliates, saveAffiliates } from "@/lib/affiliates";

export const runtime = "nodejs";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }   // 👈 เปลี่ยนเป็น Promise
) {
  const { id } = await params;                       // 👈 await ก่อนใช้
  const payload = await req.json();

  const items = await loadAffiliates();
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return NextResponse.json({ error: "not found" }, { status: 404 });

  const updated = { ...items[idx], ...payload, id }; // lock id เดิม
  items[idx] = updated;
  await saveAffiliates(items);

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }   // 👈 เช่นกัน
) {
  const { id } = await params;

  const items = await loadAffiliates();
  const next = items.filter((i) => i.id !== id);
  if (next.length === items.length) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  await saveAffiliates(next);
  return NextResponse.json({ ok: true });
}