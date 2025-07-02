import BreakthroughsPage from "@/components/app/BreakthroughsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "الأفكار | Bio Pharma Stock",
  description: "عرض إشارات التداول الحالية لأسهم الأدوية.",
  keywords: [
    "إشارات الأسهم الدوائية",
    "إشارات التداول",
    "أسهم شركات الأدوية",
    "سوق الأسهم",
    "الاستثمار",
    "تحليل إشارات الأسهم",
    "تداول الأسهم الدوائية",
    "إشارات البيع والشراء",
    "التحليل الفني",
    "اتجاهات السوق",
    "توقعات أسعار الأسهم",
    "تداول قطاع الأدوية",
    "إشارات الأسهم بالذكاء الاصطناعي",
    "مؤشرات الأسواق المالية",
    "أفضل أسهم الأدوية",
  ],
};
export default function Breakthroughs() {
  return (
    <main className="container mx-auto px-4 py-8">
      <BreakthroughsPage lang="ar" />
    </main>
  );
}
