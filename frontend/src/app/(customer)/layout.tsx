import Navbar from '@/components/shared/Navbar';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <main>{children}</main>
      <footer className="mt-16 border-t border-neutral-200 bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-neutral-500">
          © 2026 Wandrer — Nền tảng đặt tour du lịch trực tuyến
        </div>
      </footer>
    </div>
  );
}
