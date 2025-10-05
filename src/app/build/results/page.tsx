"use client";
import { useBuildStore } from "@/lib/store";
import { checkCompatibility } from "@/lib/rules";
import { estimateBuild } from "@/lib/estimator";
import { GameBaselines } from "@/lib/data";
import Link from "next/link";

export default function ResultsPage() {
  const { build } = useBuildStore();
  const compat = checkCompatibility(build);
  const result = estimateBuild(build, GameBaselines);

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-bold mb-3">ผลการประเมิน</h1>

      {!compat.ok ? (
        <>
          <p className="text-red-700 mb-4">
            สเป็กยังไม่ผ่านเงื่อนไข: กรุณากลับไปแก้ไขให้ถูกต้อง
          </p>
          <Link href="/build" className="underline text-blue-600">ย้อนกลับไปแก้</Link>
        </>
      ) : (
        <>
          <div className="p-4 rounded-2xl shadow mb-4 bg-white">
            <div className="text-xl">
              Build Score: <b>{result.buildScore}</b> / ~1000
            </div>
            <div>Confidence: {result.confidence}</div>
          </div>

          <div className="p-4 rounded-2xl shadow bg-white">
            <h2 className="font-semibold mb-2">ประมาณ FPS (ค่าเฉลี่ย)</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">เกม</th>
                  <th className="py-2">1080p</th>
                  <th className="py-2">1440p</th>
                </tr>
              </thead>
              <tbody>
                {result.fps.map((x) => (
                  <tr key={x.gameId} className="border-b">
                    <td className="py-2">{x.title}</td>
                    <td className="py-2">{x.p1080} FPS</td>
                    <td className="py-2">{x.p1440} FPS</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <Link href="/build" className="underline text-blue-600">ปรับสเป็คเพิ่มเติม</Link>
          </div>
        </>
      )}
    </main>
  );
}