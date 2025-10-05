import { promises as fs } from "fs";
import path from "path";
import { AffiliateItem } from "./affiliate-types";

const filePath = path.join(process.cwd(), "data", "affiliates.json");

async function ensureFile() {
  try { await fs.access(filePath); }
  catch { await fs.mkdir(path.dirname(filePath), { recursive: true }); await fs.writeFile(filePath, "[]", "utf8"); }
}

export async function loadAffiliates(): Promise<AffiliateItem[]> {
  await ensureFile();
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as AffiliateItem[];
}

export async function saveAffiliates(items: AffiliateItem[]) {
  await ensureFile();
  await fs.writeFile(filePath, JSON.stringify(items, null, 2), "utf8");
}