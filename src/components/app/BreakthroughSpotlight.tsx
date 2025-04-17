"use client";

import { motion, useInView } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, Dna, Pill, Microscope } from "lucide-react";
import { useState, useRef, ReactNode } from "react";
interface SectionHeaderProps {
  title: string;
  icon: ReactNode; // or JSX.Element if you're only using components
  description: string;
}
interface Breakthrough {
  id: number;
  title: string;
  company: string;
  symbol: string;
  description: string;
  potentialImpact: string;
  category: "drug" | "therapy" | "device";
  stage: "research" | "clinical" | "approved";
}

const breakthroughs: Breakthrough[] = [
  {
    id: 1,
    title: "Revolutionary mRNA Cancer Vaccine",
    company: "GeneticaPharm",
    symbol: "GNPH",
    description:
      "A groundbreaking mRNA vaccine that trains the immune system to recognize and attack specific cancer cells, showing 78% efficacy in early trials.",
    potentialImpact:
      "Could transform cancer treatment from reactive to preventative, potentially creating a $50B market by 2030.",
    category: "therapy",
    stage: "clinical",
  },
  {
    id: 2,
    title: "AI-Powered Drug Discovery Platform",
    company: "NeuraTech Pharmaceuticals",
    symbol: "NRPH",
    description:
      "Using artificial intelligence to identify novel drug candidates 100x faster than traditional methods, with 3 compounds already in Phase I trials.",
    potentialImpact:
      "May reduce drug development time from 10 years to 3 years, potentially saving billions in R&D costs.",
    category: "drug",
    stage: "research",
  },
  {
    id: 3,
    title: "Nanobody Therapy for Alzheimer's",
    company: "CerebraTech",
    symbol: "CRTX",
    description:
      "A revolutionary nanobody therapy that can cross the blood-brain barrier and clear amyloid plaques, showing cognitive improvement in 65% of patients.",
    potentialImpact:
      "First effective treatment for Alzheimer's could capture a $20B market with 55 million patients worldwide.",
    category: "therapy",
    stage: "clinical",
  },
];

const categoryIcons = {
  drug: Pill,
  therapy: Dna,
  device: Microscope,
};

export default function BreakthroughSpotlight() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % breakthroughs.length);
      setIsAnimating(false);
    }, 300);
  };

  const handlePrev = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setActiveIndex(
        (prev) => (prev - 1 + breakthroughs.length) % breakthroughs.length
      );
      setIsAnimating(false);
    }, 300);
  };

  const activeBreakthrough = breakthroughs[activeIndex];
  const CategoryIcon = categoryIcons[activeBreakthrough.category];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section header with scroll animation */}
        <SectionHeader
          title="Breakthrough Spotlight"
          icon={<Lightbulb className="mr-2 text-brightTeal" />}
          description="Discover revolutionary pharmaceutical innovations that could transform medicine and create exceptional investment opportunities."
        />

        <div className="max-w-4xl mx-auto">
          <motion.div
            animate={{ opacity: isAnimating ? 0 : 1, y: isAnimating ? 20 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden border-2 border-brightTeal/20 shadow-lg">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-5">
                  <div className="md:col-span-2 bg-gradient-to-br from-royalBlue to-brightTeal p-6 text-white flex flex-col justify-center">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                      key={activeIndex} // Re-trigger animation when active item changes
                    >
                      <div className="mb-4">
                        <Badge className="bg-white/20 hover:bg-white/30 text-white">
                          {activeBreakthrough.stage === "research"
                            ? "Research Stage"
                            : activeBreakthrough.stage === "clinical"
                            ? "Clinical Trials"
                            : "FDA Approved"}
                        </Badge>
                      </div>
                      <h3 className="text-2xl font-bold mb-2">
                        {activeBreakthrough.title}
                      </h3>
                      <div className="flex items-center mb-4">
                        <CategoryIcon className="mr-2 h-5 w-5" />
                        <span className="text-sm opacity-90">
                          {activeBreakthrough.category === "drug"
                            ? "Novel Drug"
                            : activeBreakthrough.category === "therapy"
                            ? "Advanced Therapy"
                            : "Medical Device"}
                        </span>
                      </div>
                      <div className="mt-auto">
                        <p className="text-sm opacity-80">
                          <span className="font-semibold">
                            {activeBreakthrough.company}
                          </span>{" "}
                          ({activeBreakthrough.symbol})
                        </p>
                      </div>
                    </motion.div>
                  </div>
                  <div className="md:col-span-3 p-6">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                      key={activeIndex} // Re-trigger animation when active item changes
                    >
                      <h4 className="text-lg font-semibold text-royalBlue mb-4">
                        The Innovation
                      </h4>
                      <p className="mb-4 text-gray-700">
                        {activeBreakthrough.description}
                      </p>

                      <h4 className="text-lg font-semibold text-royalBlue mb-4">
                        Market Potential
                      </h4>
                      <p className="mb-6 text-gray-700">
                        {activeBreakthrough.potentialImpact}
                      </p>

                      <div className="flex justify-between items-center mt-auto">
                        <div className="flex space-x-2">
                          {breakthroughs.map((_, index) => (
                            <button
                              key={index}
                              className={`w-3 h-3 rounded-full ${
                                index === activeIndex
                                  ? "bg-brightTeal"
                                  : "bg-gray-300"
                              }`}
                              onClick={() => setActiveIndex(index)}
                            />
                          ))}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePrev}
                            className="border-royalBlue text-royalBlue"
                          >
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleNext}
                            className="border-royalBlue text-royalBlue"
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {" "}
            <Button className="bg-brightTeal hover:bg-brightTeal/90 text-white">
              Explore All Breakthroughs <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div> */}
        </div>
      </div>
    </section>
  );
}

// Add this component at the end of the file, before the closing }
function SectionHeader({ title, icon, description }: SectionHeaderProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className="text-center mb-12"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.7 }}
    >
      <motion.h2
        className="text-3xl font-bold text-royalBlue mb-2 flex items-center justify-center"
        initial={{ scale: 0.9 }}
        animate={isInView ? { scale: 1 } : { scale: 0.9 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {icon} {title}
      </motion.h2>
      <motion.div
        initial={{ width: 0 }}
        animate={isInView ? { width: "100px" } : { width: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="h-1 bg-brightTeal mx-auto mb-4"
      />
      <motion.p
        className="text-gray-600 max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        {description}
      </motion.p>
    </motion.div>
  );
}
