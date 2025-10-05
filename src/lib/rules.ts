import { Build } from "./types";

export function checkCompatibility(b: Build) {
  const errors: string[] = [];
  const warns: string[] = [];

  if (b.cpu && b.mainboard) {
    if (b.cpu.socket !== b.mainboard.socket) {
      errors.push(`CPU (${b.cpu.socket}) ไม่ตรงกับ Mainboard (${b.mainboard.socket})`);
    }
    if (b.cpu.brand === "AMD" && b.cpu.socket === "AM5" && (b.cpu.gen ?? 0) < 7) {
      errors.push("AM5 ต้องใช้ AMD Ryzen Gen 7 (7000) ขึ้นไป");
    }
  }

  if (b.mainboard && b.ram) {
    if (b.mainboard.memoryType !== b.ram.type) {
      errors.push(`RAM (${b.ram.type}) ไม่ตรงกับ Mainboard (${b.mainboard.memoryType})`);
    }
    if (b.ram.speed > b.mainboard.memoryMaxSpeed) {
      warns.push(`ความเร็ว RAM สูงกว่า spec บอร์ด (max ${b.mainboard.memoryMaxSpeed} MT/s) อาจวิ่งลดลง`);
    }
  }

  if (b.case && b.mainboard) {
    if (!b.case.formSupport.includes(b.mainboard.formFactor)) {
      errors.push(`เคสไม่รองรับฟอร์มแฟกเตอร์ ${b.mainboard.formFactor}`);
    }
  }

  if (b.psu && (b.cpu || b.gpu)) {
    const need = (b.cpu?.tdp ?? 0) + (b.gpu?.tgp ?? 0);
    const headroom = Math.ceil(need * 1.3);
    if (b.psu.watt < headroom) {
      errors.push(`PSU วัตต์ไม่พอ ต้องอย่างน้อย ~${headroom}W`);
    }
    if (b.gpu) {
      const required = b.gpu.connectors ?? [];
      const has = new Set(b.psu.connectors);
      const ok = required.every(c => has.has(c));
      if (!ok) {
        warns.push("หัวต่อไฟเลี้ยงการ์ดจออาจไม่ครบ/ไม่ตรงชนิด");
      }
    }
  }

  return { errors, warns, ok: errors.length === 0 };
}