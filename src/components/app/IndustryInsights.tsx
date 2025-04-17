"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Lightbulb, TrendingUp, BarChart3 } from "lucide-react";

interface InsightData {
  title: string;
  description: string;
  impact: "positive" | "negative" | "neutral";
  sectors: string[];
}

const insights: InsightData[] = [
  {
    title: "AI in Drug Discovery Gains Ground",
    description:
      "Top pharma firms have increased investment in AI by 40% YoY, accelerating early-stage drug screening and lowering R&D costs across oncology and neurology.",
    impact: "positive",
    sectors: ["AI", "Biotech", "Pharma R&D"],
  },
  {
    title: "Biosimilars Disrupt Patent-Expired Blockbusters",
    description:
      "With Humira’s patent expired, biosimilars are projected to save $180B in drug spending globally by 2028, putting pressure on branded revenue streams.",
    impact: "negative",
    sectors: ["Generics", "Biologics", "Healthcare Cost"],
  },
  {
    title: "Precision Medicine Becomes Mainstream",
    description:
      "Over 50% of new FDA approvals in 2023 were tied to targeted or biomarker-driven therapies, reflecting a shift toward individualized treatment plans.",
    impact: "positive",
    sectors: ["Genomics", "Diagnostics", "Oncology"],
  },
];

const marketTrendData = [
  { year: "2018", traditional: 100, precision: 40, digital: 20 },
  { year: "2019", traditional: 104, precision: 65, digital: 38 },
  { year: "2020", traditional: 108, precision: 95, digital: 65 },
  { year: "2021", traditional: 110, precision: 130, digital: 100 },
  { year: "2022", traditional: 113, precision: 165, digital: 140 },
  { year: "2023", traditional: 115, precision: 200, digital: 190 },
  { year: "2024", traditional: 117, precision: 240, digital: 250 },
  { year: "2025", traditional: 120, precision: 280, digital: 310 },
];

export default function IndustryInsights() {
  return (
    <section className="py-16 bg-gradient-to-br from-royalBlue/5 via-royalBlue/2 to-brightTeal/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-royalBlue mb-2 flex items-center justify-center">
            <Lightbulb className="mr-2 text-brightTeal" /> Industry Insights
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            In-depth data and trends shaping the future of pharmaceuticals —
            from AI-driven R&D to biosimilar disruption.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Card className="shadow-lg h-full">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-royalBlue mb-4 flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-brightTeal" />
                  Pharmaceutical Market Segmentation Growth
                </h3>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={marketTrendData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="traditional"
                        name="Traditional Pharma"
                        stroke="#0A2472"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="precision"
                        name="Precision Medicine"
                        stroke="#00A896"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="digital"
                        name="Digital Therapeutics"
                        stroke="#B8E994"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Indexed growth (2018 = 100) shows precision and digital
                  therapies scaling faster than legacy pharma pipelines.
                </p>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="shadow-lg h-full">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-royalBlue mb-4 flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5 text-brightTeal" /> Key
                  Trends
                </h3>
                <div className="space-y-6">
                  {insights.map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="pb-4 border-b border-gray-200 last:border-0"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800">
                          {insight.title}
                        </h4>
                        <Badge
                          className={
                            insight.impact === "positive"
                              ? "bg-green-100 text-green-800"
                              : insight.impact === "negative"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }
                        >
                          {insight.impact === "positive"
                            ? "Bullish"
                            : insight.impact === "negative"
                            ? "Bearish"
                            : "Neutral"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {insight.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {insight.sectors.map((sector) => (
                          <Badge
                            key={sector}
                            variant="outline"
                            className="text-xs"
                          >
                            {sector}
                          </Badge>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-xs text-gray-500 mt-8"
        >
          *Data based on industry research and updated in April 2025.
        </motion.p>
      </div>
    </section>
  );
}
