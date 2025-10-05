export type Socket = "AM5" | "LGA1700";
export type Chipset = "X670" | "B650" | "Z790" | "B760";
export type MemoryType = "DDR4" | "DDR5";
export type FormFactor = "ATX" | "Micro-ATX" | "Mini-ITX";

export interface CPU {
  id: string;
  brand: "AMD" | "Intel";
  model: string;
  gen: number;        // 7 = Ryzen 7000
  socket: Socket;
  tdp: number;        // watts
  score: number;      // 0–1000 (mock)
}

export interface Mainboard {
  id: string;
  socket: Socket;
  chipset: Chipset;
  memoryType: MemoryType;
  memoryMaxSpeed: number; // MT/s
  formFactor: FormFactor;
}

export interface GPU {
  id: string;
  brand: "NVIDIA" | "AMD";
  model: string;
  tgp: number;        // watts
  score: number;      // 0–1000 (mock)
  connectors: ("8pin" | "6pin" | "12vhpwr")[];
}

export interface RAM {
  id: string;
  type: MemoryType;
  sizeGB: number;
  speed: number;      // MT/s
}

export interface Storage {
  id: string;
  type: "NVMe" | "SATA";
  gen?: "Gen3" | "Gen4";
}

export interface PSU {
  id: string;
  watt: number;
  connectors: ("8pin" | "6pin" | "12vhpwr")[];
}

export interface CaseChassis {
  id: string;
  formSupport: FormFactor[];
}

export interface Cooler {
  id: string;
  tdpSupport: number;
  socketSupport: Socket[];
}

export interface Build {
  cpu?: CPU;
  mainboard?: Mainboard;
  gpu?: GPU;
  ram?: RAM;
  storage?: Storage;
  psu?: PSU;
  case?: CaseChassis;
  cooler?: Cooler;
}