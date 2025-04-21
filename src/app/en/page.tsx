import Hero from "@/components/app/Hero";
import TopStocksSlider from "@/components/app/TopStocksSlider";
import WhyPharmaSector from "@/components/app/WhyPharmaSector";
import WhyUs from "@/components/app/WhyUs";
import BreakthroughSpotlight from "@/components/app/BreakthroughSpotlight";
import IndustryInsights from "@/components/app/IndustryInsights";
import GlobalPharmaMap from "@/components/app/GlobalPharmaMap";
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
        <BreakthroughSpotlight lang="en" />
        <IndustryInsights lang="en" />
        <GlobalPharmaMap lang="en" />
        <WhyUs lang="en" />
      </div>

      <div className="container mx-auto py-8 " id="whyUs"></div>
    </main>
  );
}
