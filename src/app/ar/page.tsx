import Hero from "@/components/app/Hero";
import TopStocksSlider from "@/components/app/TopStocksSlider";
import WhyPharmaSector from "@/components/app/WhyPharmaSector";
import WhyUs from "@/components/app/WhyUs";
export const metadata = {
  title: "أفضل أسهم الأدوية وتحليلات السوق | مصدرك الموثوق",
  description:
    "احصل على أحدث التحليلات حول أسهم الأدوية ونتائج التجارب السريرية واتجاهات السوق. تحليل مدعوم بالذكاء الاصطناعي لاتخاذ قرارات استثمارية أكثر ذكاءً.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-pureWhite rtl">
      <Hero lang="ar" />
      <TopStocksSlider lang="ar" />
      <div className="  py-8">
        <WhyPharmaSector lang="ar" />
      </div>

      <div className="container mx-auto px-4 py-8" id="whyUs">
        <WhyUs lang="ar" />
      </div>
    </main>
  );
}
