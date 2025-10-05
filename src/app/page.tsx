import Link from "next/link";

export default function HomePage() {
  return (
    <main className="max-w-5xl mx-auto p-6 grid gap-6">
      <h1 className="text-3xl font-bold">PC Builder</h1>
      <div className="flex gap-5">
        <Link href="/catalog" className="inline-flex w-fit px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-700">เริ่มจัดสเป็ค</Link>
        <Link href="/build" className="inline-flex w-fit px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">เริ่มจัดสเป็ค</Link>
      </div>
    </main>
  );
}