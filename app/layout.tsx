import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "익명 게시판",
  description: "Next.js와 Supabase로 만든 익명 게시판",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm">
            <div className="max-w-4xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">익명 게시판</h1>
                <nav className="flex gap-4">
                  <Link
                    href="/"
                    className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
                  >
                    홈
                  </Link>
                  <Link
                    href="/stats"
                    className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
                  >
                    통계
                  </Link>
                </nav>
              </div>
            </div>
          </header>
          <main className="max-w-4xl mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
