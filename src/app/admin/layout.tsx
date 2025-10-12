import type { ReactNode } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-royalBlue text-pureWhite p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/admin" className="text-2xl font-bold">
            PharmaStock Admin
          </Link>
          <div className="space-x-4">
            <Link href="/admin" className="hover:text-brightTeal">
              Home
            </Link>
            <Link href="/admin/signals" className="hover:text-brightTeal">
              Signals
            </Link>
            <Link href="/admin/daily-video" className="hover:text-brightTeal">
              Daily Video
            </Link>
            <Link href="/admin/news" className="hover:text-brightTeal">
              News
            </Link>
            <Link href="/admin/breakthroughs" className="hover:text-brightTeal">
              breakthroughs
            </Link>
            <Link href="/admin/history" className="hover:text-brightTeal">
              History
            </Link>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardContent>{children}</CardContent>
        </Card>
      </main>
    </div>
  );
}
