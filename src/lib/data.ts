import { CPU, GPU, Mainboard, RAM, Storage, PSU, CaseChassis, Cooler } from "./types";

export const CPUs: CPU[] = [
  { id: "cpu-ryzen7600", brand: "AMD", model: "Ryzen 5 7600", gen: 7, socket: "AM5", tdp: 65, score: 560 },
  { id: "cpu-ryzen7800x3d", brand: "AMD", model: "Ryzen 7 7800X3D", gen: 7, socket: "AM5", tdp: 120, score: 860 },
  { id: "cpu-i5-13600k", brand: "Intel", model: "Core i5-13600K", gen: 13, socket: "LGA1700", tdp: 125, score: 720 },
];

export const MBs: Mainboard[] = [
  { id: "mb-b650", socket: "AM5", chipset: "B650", memoryType: "DDR5", memoryMaxSpeed: 6000, formFactor: "ATX" },
  { id: "mb-x670", socket: "AM5", chipset: "X670", memoryType: "DDR5", memoryMaxSpeed: 6400, formFactor: "ATX" },
  { id: "mb-z790", socket: "LGA1700", chipset: "Z790", memoryType: "DDR5", memoryMaxSpeed: 7200, formFactor: "ATX" },
];

export const GPUs: GPU[] = [
  { id:"gpu-rtx4070",  brand:"NVIDIA", model:"RTX 4070",    tgp:200, score:780, connectors:["8pin"] },
  { id:"gpu-rtx4070ti",brand:"NVIDIA", model:"RTX 4070 Ti", tgp:285, score:840, connectors:["8pin"] },
  { id:"gpu-rx7800xt", brand:"AMD",    model:"RX 7800 XT",  tgp:260, score:800, connectors:["8pin"] },
  { id:"gpu-rx7900xt", brand:"AMD",    model:"RX 7900 XT",  tgp:300, score:880, connectors:["8pin","8pin"] },
];

export const RAMs: RAM[] = [
  { id: "ram-32-ddr5-6000", type: "DDR5", sizeGB: 32, speed: 6000 },
  { id: "ram-16-ddr5-5600", type: "DDR5", sizeGB: 16, speed: 5600 },
];

export const STORs: Storage[] = [
  { id: "nvme-1tb", type: "NVMe", gen: "Gen4" },
  { id: "sata-1tb", type: "SATA" },
];

export const PSUs: PSU[] = [
  { id: "psu-650w", watt: 650, connectors: ["8pin", "8pin"] },
  { id: "psu-750w", watt: 750, connectors: ["8pin", "8pin"] },
];

export const CASEs: CaseChassis[] = [
  { id: "case-atx", formSupport: ["ATX", "Micro-ATX"] },
];

export const COOLERs: Cooler[] = [
  { id: "cooler-150w", tdpSupport: 150, socketSupport: ["AM5", "LGA1700"] },
];

export const GameBaselines = [
  {
    id: "apex",
    title: "Apex Legends",
    baselineGpuRef: 650,
    baselineCpuRef: 500,
    baselineFps1080p: 160,
    baselineFps1440p: 120,
    alphaGpu: 0.9,
    betaCpu: 0.4,
  },
  {
    id: "fortnite",
    title: "Fortnite",
    baselineGpuRef: 650,
    baselineCpuRef: 500,
    baselineFps1080p: 180,
    baselineFps1440p: 130,
    alphaGpu: 0.95,
    betaCpu: 0.35,
  },
];