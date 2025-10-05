import PartPicker from "@/components/PartPicker";
import CompatibilityBanner from "@/components/CompatibilityBanner";
import Link from "next/link";

export default function BuildPage() {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-bold mb-4">จัดสเป็คคอม</h1>
      <PartPicker />
      <CompatibilityBanner />
      <div className="mt-6">
        <Link
          href="/build/results"
          className="px-4 py-2 rounded-xl shadow border bg-white hover:bg-gray-50"
        >
          คำนวณคะแนน & FPS
        </Link>
      </div>
    </main>
  );
}