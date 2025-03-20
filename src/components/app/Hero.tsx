"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  TrendingUp,
  DollarSign,
  Zap,
  ArrowLeft,
} from "lucide-react";

interface LangProps {
  lang: "en" | "ar";
}

const translations = {
  en: {
    title: "Invest Smart in Pharma Stocks",
    description:
      "Unlock the potential of pharmaceutical markets with our advanced insights and expert analysis.",
    getStarted: "Get Started",
    learnMore: "Learn More",
    advantages: "PharmaStock Advantages",
    realTimeAnalysis: "Real-time market analysis",
    highPotential: "High-potential stock picks",
    aiPredictions: "AI-powered predictions",
  },
  ar: {
    title: "استثمر بذكاء في أسهم الأدوية",
    description:
      "افتح إمكانيات الأسواق الصيدلانية مع رؤانا المتقدمة وتحليلات الخبراء.",
    getStarted: "ابدأ الآن",
    learnMore: "اعرف المزيد",
    advantages: "مزايا PharmaStock",
    realTimeAnalysis: "تحليل السوق في الوقت الحقيقي",
    highPotential: "اختيارات الأسهم ذات الإمكانات العالية",
    aiPredictions: "تنبؤات مدعومة بالذكاء الاصطناعي",
  },
};

export default function Hero({ lang }: LangProps) {
  const t = translations[lang] || translations.en;

  const handleScroll = function () {
    const element = document.getElementById("whyUs");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-royalBlue text-pureWhite py-20 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl md:text-6xl font-bold mb-4"
            >
              {t.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-xl mb-8"
            >
              {t.description}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              className="flex space-x-4 rtl:space-x-reverse"
            >
              <Button
                size="lg"
                className="bg-brightTeal hover:bg-brightTeal/90 text-royalBlue"
              >
                {t.getStarted}
                {lang == "ar" ? (
                  <ArrowLeft className="mr-2 h-5 w-5" />
                ) : (
                  <ArrowRight className="ml-2 h-5 w-5" />
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-brightTeal border-pureWhite hover:bg-pureWhite hover:text-royalBlue"
                onClick={handleScroll}
              >
                {t.learnMore}
              </Button>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: lang === "ar" ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="hidden md:block"
          >
            <div className="bg-pureWhite/10 backdrop-blur-md rounded-lg p-6 shadow-xl">
              <h3 className="text-2xl font-semibold mb-4">{t.advantages}</h3>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <TrendingUp
                    className={`${
                      lang === "ar" ? "ml-2" : "mr-2"
                    } h-5 w-5 text-brightTeal`}
                  />
                  <span>{t.realTimeAnalysis}</span>
                </li>
                <li className="flex items-center">
                  <DollarSign
                    className={`${
                      lang === "ar" ? "ml-2" : "mr-2"
                    } h-5 w-5 text-brightTeal`}
                  />
                  <span>{t.highPotential}</span>
                </li>
                <li className="flex items-center">
                  <Zap
                    className={`${
                      lang === "ar" ? "ml-2" : "mr-2"
                    } h-5 w-5 text-brightTeal`}
                  />
                  <span>{t.aiPredictions}</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-royalBlue via-royalBlue to-brightTeal opacity-50"></div>
    </motion.section>
  );
}
