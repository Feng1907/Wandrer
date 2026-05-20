import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import AIChatWidget from '@/components/shared/AIChatWidget';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <AIChatWidget />
    </div>
  );
}
