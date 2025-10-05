export const CHIPSETS = [
  "A620","B650","B650E","X670","X670E",
  "H610","B660","B760","Z690","Z790"
] as const;
export type Chipset = (typeof CHIPSETS)[number];

// แปลง string อิสระ → Chipset (ถ้าตรงเท่านั้น)
export function toChipset(s?: string): Chipset | undefined {
  if (!s) return undefined;
  const norm = s.toUpperCase().replace(/\s+/g, "");
  return CHIPSETS.find(c => c === norm);
}