"use client";

import { motion, useInView } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Lightbulb,
  Search,
  Filter,
  Dna,
  Pill,
  Microscope,
  Building2,
} from "lucide-react";
import { useState, useRef, Dispatch, SetStateAction } from "react";
import useSWR from "swr";

interface Breakthrough {
  id: number;
  title_en: string;
  title_ar: string;
  company: string;
  symbol: string;
  description_en: string;
  description_ar: string;
  potential_impact_en: string;
  potential_impact_ar: string;
  category: "drug" | "therapy" | "device";
  stage: "research" | "clinical" | "approved";
  created_at: string;
}
interface FiltersSectionProps {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  selectedCategory: string;
  setSelectedCategory: Dispatch<SetStateAction<string>>;
  selectedStage: string;
  setSelectedStage: Dispatch<SetStateAction<string>>;
  t: (typeof translations)["en"];
  lang: "en" | "ar";
}

const categoryIcons = {
  drug: Pill,
  therapy: Dna,
  device: Microscope,
};

const stageColors = {
  research: "bg-blue-100 text-blue-800",
  clinical: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
};

interface BreakthroughsPageProps {
  lang?: "en" | "ar";
}

const translations = {
  en: {
    pageTitle: "FDA Designations",
    pageDesc:
      "Explore companies granted FDA designations for innovative drugs, therapies, and devices poised to impact the healthcare landscape.",
    filterTitle: "Filter Breakthroughs",
    searchPlaceholder: "Search breakthroughs...",
    allCategories: "All Categories",
    novelDrugs: "Novel Drugs",
    advancedTherapies: "Advanced Therapies",
    medicalDevices: "Medical Devices",
    allStages: "All Stages",
    researchStage: "Research Stage",
    clinicalTrials: "Clinical Trials",
    fdaApproved: "FDA Approved",
    showAll: "Show All",
    showLess: "Show Less",
    marketPotential: "Market Potential",
    showing: "Showing",
    of: "of",
    breakthroughs: "breakthroughs",
  },
  ar: {
    pageTitle: "تعيينات هيئة الغذاء والدواء (FDA)",
    pageDesc:
      "استكشف الشركات التي حصلت على تعيينات من هيئة الغذاء والدواء للأدوية والعلاجات والأجهزة المبتكرة ذات التأثير المحتمل على قطاع الرعاية الصحية.",
    filterTitle: "تصفية الابتكارات",
    searchPlaceholder: "ابحث في الابتكارات...",
    allCategories: "كل الفئات",
    novelDrugs: "أدوية مبتكرة",
    advancedTherapies: "علاجات متقدمة",
    medicalDevices: "أجهزة طبية",
    allStages: "كل المراحل",
    researchStage: "مرحلة البحث",
    clinicalTrials: "التجارب السريرية",
    fdaApproved: "معتمد من FDA",
    showAll: "عرض الكل",
    showLess: "عرض أقل",
    marketPotential: "إمكانات السوق",
    showing: "عرض",
    of: "من",
    breakthroughs: "ابتكارات",
  },
};

export default function BreakthroughsPage({
  lang = "en",
}: BreakthroughsPageProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStage, setSelectedStage] = useState<string>("all");

  // Compose the API URL based on fetchAll
  const apiUrl = "/api/breakthroughs?all=true";

  // Fetch data from API
  const {
    data: breakthroughs = [],
    isLoading,
    error,
  } = useSWR<Breakthrough[]>(apiUrl, async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  });

  // Filtering logic (search in English fields)
  const filteredBreakthroughs = breakthroughs.filter((breakthrough) => {
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      lang === "ar"
        ? breakthrough.title_ar.toLowerCase().includes(term) ||
          breakthrough.description_ar.toLowerCase().includes(term) ||
          breakthrough.company.toLowerCase().includes(term)
        : breakthrough.title_en.toLowerCase().includes(term) ||
          breakthrough.description_en.toLowerCase().includes(term) ||
          breakthrough.company.toLowerCase().includes(term);

    const matchesCategory =
      selectedCategory === "all" || breakthrough.category === selectedCategory;
    const matchesStage =
      selectedStage === "all" || breakthrough.stage === selectedStage;

    return matchesSearch && matchesCategory && matchesStage;
  });

  const t = translations[lang];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading breakthroughs.</div>;

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 ${
        lang === "ar" ? "text-right" : ""
      }`}
    >
      {/* Page Header */}
      <PageHeader t={t} lang={lang} />

      {/* Filters Section */}
      <FiltersSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedStage={selectedStage}
        setSelectedStage={setSelectedStage}
        t={t}
        lang={lang}
      />

      {/* Results Count */}
      <ResultsCount
        count={filteredBreakthroughs.length}
        total={breakthroughs.length}
        t={t}
        lang={lang}
      />

      {/* Breakthroughs Grid */}
      <BreakthroughsGrid
        breakthroughs={filteredBreakthroughs}
        t={t}
        lang={lang}
      />
    </div>
  );
}

function PageHeader({
  t,
  lang,
}: {
  t: (typeof translations)["en"];
  lang: "en" | "ar";
}) {
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
      <motion.h1
        className="text-4xl font-bold text-royalBlue mb-4 flex items-center justify-center"
        initial={{ scale: 0.9 }}
        animate={isInView ? { scale: 1 } : { scale: 0.9 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Lightbulb
          className={`${lang === "en" ? "mr-3" : "ml-3"} text-brightTeal`}
          size={40}
        />
        {lang === "ar" ? t.pageTitle : t.pageTitle}
      </motion.h1>
      <motion.div
        initial={{ width: 0 }}
        animate={isInView ? { width: "150px" } : { width: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="h-1 bg-brightTeal mx-auto mb-6"
      />
      <motion.p
        className="text-xl text-gray-600 max-w-3xl mx-auto"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        {lang === "ar" ? t.pageDesc : t.pageDesc}
      </motion.p>
    </motion.div>
  );
}

function FiltersSection({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedStage,
  setSelectedStage,
  t,
  lang,
}: FiltersSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className="mb-8"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Filter className="mr-2 h-5 w-5 text-brightTeal" />
            <h3 className="text-lg font-semibold text-royalBlue">
              {t.filterTitle}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brightTeal"
            >
              <option value="all">{t.allCategories}</option>
              <option value="drug">
                {lang === "ar" ? "أدوية مبتكرة" : "Novel Drugs"}
              </option>
              <option value="therapy">
                {lang === "ar" ? "علاجات متقدمة" : "Advanced Therapies"}
              </option>
              <option value="device">
                {lang === "ar" ? "أجهزة طبية" : "Medical Devices"}
              </option>
            </select>

            {/* Stage Filter */}
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brightTeal"
            >
              <option value="all">{t.allStages}</option>
              <option value="research">
                {lang === "ar" ? "مرحلة البحث" : "Research Stage"}
              </option>
              <option value="clinical">
                {lang === "ar" ? "التجارب السريرية" : "Clinical Trials"}
              </option>
              <option value="approved">
                {lang === "ar" ? "معتمد من FDA" : "FDA Approved"}
              </option>
            </select>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface ResultsCountProps {
  count: number;
  total: number;
  t: (typeof translations)["en"];
  lang: "en" | "ar";
}
function ResultsCount({ count, total, t }: ResultsCountProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className="mb-6"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <p className="text-gray-600">
        {t.showing}{" "}
        <span className="font-semibold text-royalBlue">{count}</span> {t.of}{" "}
        <span className="font-semibold text-royalBlue">{total}</span>{" "}
        {t.breakthroughs}
      </p>
    </motion.div>
  );
}

interface BreakthroughsGridProps {
  breakthroughs: Breakthrough[];
  t: (typeof translations)["en"];
  lang: "en" | "ar";
}
function BreakthroughsGrid({ breakthroughs, t, lang }: BreakthroughsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {breakthroughs.map((breakthrough, index) => (
        <BreakthroughCard
          key={breakthrough.id}
          breakthrough={breakthrough}
          index={index}
          t={t}
          lang={lang}
        />
      ))}
    </div>
  );
}

interface BreakthroughCardProps {
  breakthrough: Breakthrough;
  index: number;
  t: (typeof translations)["en"];
  lang: "en" | "ar";
}
function BreakthroughCard({
  breakthrough,
  index,
  t,
  lang,
}: BreakthroughCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const CategoryIcon = categoryIcons[breakthrough.category];

  // Format post date
  const postDate = new Date(breakthrough.created_at).toLocaleDateString();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="h-full border-2 border-gray-200 hover:border-brightTeal/50 transition-all duration-300 shadow-lg hover:shadow-xl">
        <CardContent className="p-6 flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <CategoryIcon className="mr-2 h-6 w-6 text-brightTeal" />
              <Badge className={stageColors[breakthrough.stage]}>
                {lang === "ar"
                  ? breakthrough.stage === "research"
                    ? "مرحلة البحث"
                    : breakthrough.stage === "clinical"
                    ? "التجارب السريرية"
                    : "معتمد من FDA"
                  : breakthrough.stage === "research"
                  ? "Research Stage"
                  : breakthrough.stage === "clinical"
                  ? "Clinical Trials"
                  : "FDA Approved"}
              </Badge>
            </div>
            {/* Post Date */}
            <span className="text-xs text-gray-500">{postDate}</span>
          </div>

          {/* Title and Company */}
          <h3 className="text-xl font-bold text-royalBlue mb-2">
            {lang === "ar" ? breakthrough.title_ar : breakthrough.title_en}
          </h3>
          <div className="flex items-center mb-4">
            <Building2 className="mr-1 h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {breakthrough.company} ({breakthrough.symbol})
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-700 mb-4 flex-grow">
            {lang === "ar"
              ? breakthrough.description_ar
              : breakthrough.description_en}
          </p>

          {/* Market Impact */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-royalBlue mb-2">
              {t.marketPotential}
            </h4>
            <p className="text-sm text-gray-600">
              {lang === "ar"
                ? breakthrough.potential_impact_ar
                : breakthrough.potential_impact_en}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
