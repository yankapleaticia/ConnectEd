import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/client/providers/query-provider";
import { AuthInitializer } from "@/client/providers/auth-initializer";

export const metadata: Metadata = {
  title: "ConnectEd - Community Platform",
  description: "Connect with international people living abroad or planning to move",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <QueryProvider>
          <AuthInitializer />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
