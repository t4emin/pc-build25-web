export type AffiliateCategory = "cpu" | "gpu" | "ram" | "mb" | "psu"; // ✅ เพิ่ม psu

export interface AffiliateItem {
  id: string;
  category: AffiliateCategory;
  title: string;
  brand?: string;
  model?: string;
  url: string;            // ลิงก์ affiliate
  image?: string;         // ภาพหลัก (optional)
  images?: string[];      // ✅ รองรับหลายภาพ
  price?: number | null;

  // สเปคเสริม (แล้วแต่หมวด)
  socket?: "AM5" | "LGA1700";
  gen?: number;
  tdp?: number;
  tgp?: number;
  memoryType?: "DDR4" | "DDR5";
  speed?: number;
  sizeGB?: number;

  // ✅ PSU
  watt?: number;
  connectors?: string[];  // เช่น ["8pin","8pin","24pin"]
}