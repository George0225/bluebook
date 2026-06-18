import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bb-surface-0 text-bb-text-1 px-4">
      <div className="h-16 w-16 rounded-2xl bg-bb-amber flex items-center justify-center mb-6">
        <span className="text-2xl font-black text-bb-surface-0">B</span>
      </div>
      <h1 className="text-4xl font-black mb-2">404</h1>
      <p className="text-bb-text-3 mb-6">页面不存在</p>
      <Link
        href="/"
        className="rounded-button bg-bb-amber px-6 py-2.5 text-sm font-bold text-bb-surface-0 shadow-bb-button hover:bg-bb-amber/90 transition-colors"
      >
        返回首页
      </Link>
    </div>
  );
}
