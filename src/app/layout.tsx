import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Layout/Sidebar";
import Header from "@/components/Layout/Header";
import { DataProvider } from "@/contexts/DataContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SafeGate Admin - Panel de Administración",
  description: "Panel de administración para el sistema SafeGate de seguridad comunitaria",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <DataProvider>
          <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex flex-1 flex-col lg:pl-64">
              <Header />
              <main className="flex-1 overflow-y-auto">
                {children}
              </main>
            </div>
          </div>
        </DataProvider>
      </body>
    </html>
  );
}
