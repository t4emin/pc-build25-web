"use client";
import { create } from "zustand";
import type { Build } from "./types";

type BuildState = {
  build: Build;
  setPart: <K extends keyof Build>(key: K, value: Build[K]) => void;
  reset: () => void;
};

export const useBuildStore = create<BuildState>((set) => ({
  build: {},
  setPart: (key, value) =>
    set((s) => ({ build: { ...s.build, [key]: value } })),
  reset: () => set({ build: {} }),
}));