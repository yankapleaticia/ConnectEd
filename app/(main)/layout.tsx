import { Header } from '@/client/components/layout/header';
import { Footer } from '@/client/components/layout/footer';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-surface)' }}>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
