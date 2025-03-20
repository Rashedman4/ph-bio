import Hero from "@/components/app/Hero";
import TopStocksSlider from "@/components/app/TopStocksSlider";
import WhyPharmaSector from "@/components/app/WhyPharmaSector";
import WhyUs from "@/components/app/WhyUs";
export const metadata = {
  title: "Top Pharmaceutical Stocks & Market Insights | Your Trusted Source",
  description:
    "Get the latest insights on pharmaceutical stocks, clinical trial results, and market trends. AI-driven analysis for smarter investments in the pharma sector.",
};
export default function Home() {
  return (
    <main className="min-h-screen bg-pureWhite">
      <Hero lang="en" />
      <TopStocksSlider lang="en" />
      <div className="  py-8 ">
        <WhyPharmaSector lang="en" />
      </div>

      <div className="container mx-auto px-4 py-8" id="whyUs">
        <WhyUs lang="en" />
      </div>
    </main>
  );
}
