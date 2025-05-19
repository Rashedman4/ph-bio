"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
//import { ar } from "date-fns/locale";
import { RefreshCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "../LoadingSpinner";

interface LangProps {
  lang: "en" | "ar";
}

interface NewsItem {
  id: number;
  symbol: string;
  title_en: string;
  title_ar: string;
  price: number;
  //published_date: string;
}

interface NewsResponse {
  news: NewsItem[];
  totalPages: number;
  currentPage: number;
  totalNews: number;
}

export default function NewsFeed({ lang }: LangProps) {
  const [newsData, setNewsData] = useState<NewsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchNews = async (page: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/news?page=${page}`);
      if (!response.ok) {
        throw new Error("Failed to fetch news");
      }
      const data: NewsResponse = await response.json();
      setNewsData(data);
      setCurrentPage(page);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(currentPage);
  }, [currentPage]);

  const handleRefresh = () => {
    fetchNews(1);
    setLastUpdated(new Date());
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState lang={lang} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-500">
          {lang === "ar" ? "آخر تحديث:" : "Last updated:"}{" "}
          {format(lastUpdated, "HH:mm:ss")}
        </p>
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          className="text-sm"
        >
          <RefreshCcw
            className={`w-4 h-4 ${lang === "ar" ? "ml-2" : "mr-2"}`}
          />
          {lang === "ar" ? "تحديث" : "Refresh"}
        </Button>
      </div>

      <motion.div className="space-y-4">
        {newsData?.news.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-brightTeal">
                    {item.symbol}
                  </span>
                  <span
                    className={`font-semibold ${
                      item.price > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ${item.price}
                  </span>
                </div>
                <p className="text-gray-700 mb-2">
                  {lang === "ar" ? item.title_ar : item.title_en}
                </p>
                {/*    <div className="flex items-center text-sm text-gray-500">
                  <Calendar
                    className={`w-4 h-4 ${lang === "ar" ? "ml-1" : "mr-1"}`}
                  />
                  {formatDistanceToNow(new Date(item.published_date), {
                    addSuffix: true,
                    locale: lang === "ar" ? ar : undefined,
                  })}
                </div> */}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {newsData && newsData.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          {lang === "ar" ? (
            <>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <span className="text-sm">
                صفحة {currentPage} من {newsData.totalPages}
              </span>{" "}
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === newsData.totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm">
                Page {currentPage} of {newsData.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === newsData.totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <Card className="p-4 sm:p-8">
      <LoadingSpinner />
    </Card>
  );
}

function ErrorState({ lang }: LangProps) {
  return (
    <Card className="p-4 sm:p-8 text-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-red-500 font-semibold text-xs sm:text-sm">
          {lang === "ar" ? "فشل في تحميل التوصيات." : "Failed to load signals."}
        </p>
      </motion.div>
    </Card>
  );
}
