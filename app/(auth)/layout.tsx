import { Header } from '@/client/components/layout/header';
import { Footer } from '@/client/components/layout/footer';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col bg-[color:var(--color-surface)]">
      <Header />
      <main className="flex-grow">
        <div className="mx-auto w-full max-w-md px-4 py-10">{children}</div>
      </main>
      <Footer />
    </div>
  );
}

