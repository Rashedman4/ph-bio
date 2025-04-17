"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";

interface RegionData {
  id: string;
  name: string;
  growth: number;
  companies: number;
  topSectors: string[];
  description: string;
}

const regions: RegionData[] = [
  {
    id: "north-america",
    name: "North America",
    growth: 6.15, // CAGR 2024–2033
    companies: 2325, // Number of brand name pharmaceutical manufacturers in the U.S. as of 2023
    topSectors: ["Oncology", "Neurology", "Biologics"],
    description:
      "The U.S. leads the global pharmaceutical market, accounting for approximately 30–40% of global sales, with a strong focus on oncology and biologics.",
  },
  {
    id: "europe",
    name: "Europe",
    growth: 5.7, // CAGR 2024–2033
    companies: 1800, // Estimated number of pharmaceutical companies in Europe
    topSectors: ["Oncology", "Cardiovascular", "Vaccines"],
    description:
      "Europe maintains a robust pharmaceutical industry with significant contributions in oncology, cardiovascular treatments, and vaccine development.",
  },
  {
    id: "asia-pacific",
    name: "Asia-Pacific",
    growth: 11.4, // CAGR 2024–2030
    companies: 3100, // Estimated number of pharmaceutical companies in Asia-Pacific
    topSectors: ["Generics", "Biosimilars", "Traditional Medicine"],
    description:
      "Asia-Pacific is the fastest-growing pharmaceutical market, driven by generics, biosimilars, and traditional medicine, with significant contributions from countries like India and China.",
  },
  {
    id: "emerging-markets",
    name: "Emerging Markets",
    growth: 9.8, // Estimated CAGR
    companies: 1420, // Estimated number of pharmaceutical companies in emerging markets
    topSectors: ["Infectious Diseases", "Affordable Medicine", "Telehealth"],
    description:
      "Emerging markets are rapidly developing pharmaceutical infrastructures focusing on accessible healthcare, infectious disease treatment, and telehealth solutions.",
  },
];
export default function GlobalPharmaMap() {
  const [activeRegion, setActiveRegion] = useState<string>("north-america");

  const selectedRegion =
    regions.find((region) => region.id === activeRegion) || regions[0];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-royalBlue mb-2 flex items-center justify-center">
            <Globe className="mr-2" /> Global Pharmaceutical Landscape
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover investment opportunities across the world's pharmaceutical
            markets and track regional growth trends.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden shadow-inner">
              <svg viewBox="0 0 800 400" className="w-full h-full">
                {/* Simplified world map with interactive regions */}
                <motion.path
                  d="M150,120 C180,100 220,110 250,120 C280,130 310,120 340,110 C370,100 400,110 430,120 L430,200 C400,190 370,200 340,210 C310,220 280,210 250,200 C220,190 180,200 150,180 Z"
                  fill={
                    activeRegion === "north-america" ? "#0A2472" : "#CFD8DC"
                  }
                  stroke="#fff"
                  strokeWidth="2"
                  onClick={() => setActiveRegion("north-america")}
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer"
                />
                <motion.path
                  d="M450,120 C480,110 510,120 540,130 C570,140 600,130 630,120 L630,180 C600,190 570,180 540,170 C510,160 480,170 450,180 Z"
                  fill={activeRegion === "europe" ? "#0A2472" : "#CFD8DC"}
                  stroke="#fff"
                  strokeWidth="2"
                  onClick={() => setActiveRegion("europe")}
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer"
                />
                <motion.path
                  d="M550,200 C580,190 610,200 640,210 C670,220 700,210 730,200 L730,260 C700,270 670,260 640,250 C610,240 580,250 550,260 Z"
                  fill={activeRegion === "asia-pacific" ? "#0A2472" : "#CFD8DC"}
                  stroke="#fff"
                  strokeWidth="2"
                  onClick={() => setActiveRegion("asia-pacific")}
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer"
                />
                <motion.path
                  d="M250,250 C280,240 310,250 340,260 C370,270 400,260 430,250 L430,310 C400,320 370,310 340,300 C310,290 280,300 250,310 Z"
                  fill={
                    activeRegion === "emerging-markets" ? "#0A2472" : "#CFD8DC"
                  }
                  stroke="#fff"
                  strokeWidth="2"
                  onClick={() => setActiveRegion("emerging-markets")}
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer"
                />

                {/* Region labels */}
                <text
                  x="200"
                  y="150"
                  fill={activeRegion === "north-america" ? "#fff" : "#333"}
                  fontSize="12"
                >
                  North America
                </text>
                <text
                  x="540"
                  y="150"
                  fill={activeRegion === "europe" ? "#fff" : "#333"}
                  fontSize="12"
                >
                  Europe
                </text>
                <text
                  x="640"
                  y="230"
                  fill={activeRegion === "asia-pacific" ? "#fff" : "#333"}
                  fontSize="12"
                >
                  Asia-Pacific
                </text>
                <text
                  x="340"
                  y="280"
                  fill={activeRegion === "emerging-markets" ? "#fff" : "#333"}
                  fontSize="12"
                >
                  Emerging Markets
                </text>
              </svg>

              <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm p-2 rounded-md text-xs">
                Click on a region to view detailed information
              </div>
            </div>
          </div>

          <div>
            <Card className="h-full border-2 border-royalBlue/20 bg-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-royalBlue">
                    {selectedRegion.name}
                  </h3>
                  <Badge
                    className={`${
                      selectedRegion.growth > 8
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {selectedRegion.growth > 8 ? (
                      <TrendingUp className="mr-1 h-3 w-3" />
                    ) : (
                      <TrendingDown className="mr-1 h-3 w-3" />
                    )}
                    {selectedRegion.growth}% Growth
                  </Badge>
                </div>

                <p className="text-gray-600 mb-6">
                  {selectedRegion.description}
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500">
                      TOP SECTORS
                    </h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedRegion.topSectors.map((sector) => (
                        <Badge
                          key={sector}
                          variant="outline"
                          className="bg-gray-100"
                        >
                          {sector}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-500">
                      TRACKED COMPANIES
                    </h4>
                    <p className="text-2xl font-bold text-royalBlue">
                      {selectedRegion.companies}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">
                    INVESTMENT OPPORTUNITY
                  </h4>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-brightTeal h-2.5 rounded-full"
                      style={{
                        width: `${Math.min(selectedRegion.growth * 7, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
