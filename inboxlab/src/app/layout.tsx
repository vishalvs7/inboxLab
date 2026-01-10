import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar"; // We'll create this next

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Email Tools Suite",
  description: "All-in-one email tools for marketers and businesses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Wrap entire app with AuthProvider */}
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
          <footer className="bg-gray-800 text-white py-8 text-center">
            <p>© 2024 Email Tools Suite. All rights reserved.</p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}