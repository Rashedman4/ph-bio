"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowRight, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useSession } from "next-auth/react";

const pricingPlans = [
  {
    id: "price_1Qz7rpRpsg73CUGegjYOj3Ag",
    name: "3 Months",
    price: 299,
    interval: "quarter",
    features: [
      "Real-time market analysis",
      "Basic stock recommendations",
      "Weekly market reports",
      "Email support",
    ],
  },
  {
    id: "price_1Qz7sKRpsg73CUGeas3PqPQL",
    name: "6 Months",
    price: 499,
    interval: "half-year",
    popular: true,
    features: [
      "Real-time market analysis",
      "Basic stock recommendations",
      "Weekly market reports",
      "Email support",
    ],
  },
  {
    id: "price_1Qz7r5Rpsg73CUGeCexgf4TN",
    name: "1 Year",
    price: 899,
    interval: "year",
    features: [
      "All 6-month features",
      "Personal consultation",
      "Custom portfolio tracking",
      "24/7 VIP support",
      "Expert webinars access",
    ],
  },
];

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
interface LangProps {
  lang: "en" | "ar";
}

const commonFeatures = [
  "Real-time market analysis",
  "Basic stock recommendations",
  "Weekly market reports",
  "Email support",
];

const translations = {
  en: {
    title: "Choose Your Plan",
    subtitle: "Select the perfect plan for your investment journey",
    features: "All Plans Include",
    activeUntil: "Your subscription is active until",
    subscribe: "Subscribe Now",
    processing: "Processing...",
    alreadySubscribed: "Already Subscribed",
  },
  ar: {
    title: "اختر خطتك",
    subtitle: "اختر الخطة المثالية لرحلة استثمارك",
    features: "جميع الخطط تشمل",
    activeUntil: "اشتراكك فعال حتى",
    subscribe: "اشترك الآن",
    processing: "...جاري المعالجة",
    alreadySubscribed: "مشترك بالفعل",
  },
};

export default function PricingSection({ lang }: LangProps) {
  const { status } = useSession(); // Access the session data
  const [loading, setLoading] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<
    (typeof pricingPlans)[0] | null
  >(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    isActive: boolean;
    endDate?: string;
  } | null>(null);
  const [message, setMessage] = useState("");
  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch("/api/subscriptions/status", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setSubscriptionStatus(data);
    } catch (error) {
      console.error("Error fetching subscription status:", error);
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const msg = searchParams.get("message");
    if (msg) {
      setMessage(decodeURIComponent(msg));
    }
    fetchSubscriptionStatus();
  }, []);

  const handleSubscribe = async (plan: (typeof pricingPlans)[0]) => {
    if (status !== "authenticated") {
      setMessage(
        lang === "en"
          ? "You need to log in to subscribe."
          : "يجب عليك تسجيل الدخول للاشتراك."
      );
      return;
    }
    setLoading(plan.id);
    try {
      const response = await fetch("/api/payments/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productType: plan.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Payment setup failed:", data.error);
        return;
      }

      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setSelectedPlan(plan);
      }
    } catch (error) {
      console.error("Subscription error:", error);
    } finally {
      setLoading(null);
    }
  };

  const handleCloseCheckout = () => {
    setClientSecret(null);
    setSelectedPlan(null);
  };

  const t = translations[lang];

  return (
    <section className="py-20 bg-gradient-to-br from-royalBlue to-brightTeal">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">{t.title}</h2>
          {subscriptionStatus?.isActive ? (
            <div className="bg-white/10 p-4 rounded-lg mt-4">
              <p className="text-white">
                {t.activeUntil}{" "}
                {new Date(subscriptionStatus.endDate!).toLocaleDateString()}
              </p>
            </div>
          ) : message ? (
            <div className="bg-white/10 p-4 rounded-lg mt-4">
              <p className="text-white">{message}</p>
            </div>
          ) : (
            <p className="text-white/80">{t.subtitle}</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-12 max-w-2xl mx-auto"
        >
          <h3 className="text-xl font-semibold text-white mb-4">
            {t.features}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {commonFeatures.map((feature) => (
              <div key={feature} className="flex items-center text-white">
                <Check className="h-5 w-5 text-brightTeal mr-2" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`relative ${
                  plan.popular ? "border-brightTeal" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brightTeal text-white px-4 py-1 rounded-full text-sm">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-center">
                    {plan.name}
                  </CardTitle>
                  <div className="text-center mt-4">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-gray-600">/{plan.interval}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full bg-brightTeal hover:bg-brightTeal/90"
                    onClick={() => handleSubscribe(plan)}
                    disabled={!!loading || subscriptionStatus?.isActive}
                  >
                    {loading === plan.id
                      ? t.processing
                      : subscriptionStatus?.isActive
                      ? t.alreadySubscribed
                      : t.subscribe}
                    {lang === "en" ? (
                      <ArrowRight className="ml-2 h-5 w-5" />
                    ) : (
                      <ArrowLeft className="mr-2 h-5 w-5" />
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {clientSecret && selectedPlan && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "stripe",
              },
            }}
          >
            <CheckoutForm
              clientSecret={clientSecret}
              amount={selectedPlan.price}
              onClose={handleCloseCheckout}
              lang={lang}
            />
          </Elements>
        )}
      </div>
    </section>
  );
}
