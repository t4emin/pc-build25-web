import { NextResponse } from "next/server";
import { loadAffiliates, saveAffiliates } from "@/lib/affiliates";
import { AffiliateItem, AffiliateCategory } from "@/lib/affiliate-types";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const cat = url.searchParams.get("cat") as AffiliateCategory | null;
  const q = (url.searchParams.get("q") || "").toLowerCase();

  const all = await loadAffiliates();
  const filtered = all.filter(it => {
    const byCat = cat ? it.category === cat : true;
    const byQ = q ? (it.title?.toLowerCase().includes(q) || it.model?.toLowerCase().includes(q)) : true;
    return byCat && byQ;
  });

  return NextResponse.json({ items: filtered });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<AffiliateItem>;
    if (!body.title || !body.url || !body.category) {
      return NextResponse.json({ error: "title, url, category required" }, { status: 400 });
    }
    const all = await loadAffiliates();
    const item: AffiliateItem = {
      id: crypto.randomUUID(),
      title: body.title!,
      url: body.url!,
      category: body.category as AffiliateCategory,
      brand: body.brand,
      model: body.model,
      image: body.image,
      price: body.price ?? null,
      socket: body.socket as any,
      gen: body.gen,
      tdp: body.tdp,
      tgp: body.tgp,
      memoryType: body.memoryType as any,
      speed: body.speed,
      sizeGB: body.sizeGB,
    };
    all.push(item);
    await saveAffiliates(all);
    return NextResponse.json(item, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "invalid json" }, { status: 400 });
  }
}