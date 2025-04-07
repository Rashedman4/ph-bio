"use client";

import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CheckoutFormProps {
  clientSecret: string;
  amount: number;
  onClose: () => void;
  lang: "en" | "ar";
  subscriptionId?: string;
}

export default function CheckoutForm({
  // clientSecret,
  amount,
  onClose,
  lang,
  subscriptionId,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    // If we have a subscriptionId, we're confirming a subscription
    if (subscriptionId) {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/${lang}/success?subscription_id=${subscriptionId}`,
        },
      });

      if (error) {
        setErrorMessage(error.message);
      }
    } else {
      // Fallback to regular payment confirmation
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/${lang}/success?amount=${amount}`,
        },
      });

      if (error) {
        setErrorMessage(error.message);
      }
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">Complete Payment</h3>
        <form onSubmit={handleSubmit}>
          <PaymentElement />
          {errorMessage && (
            <div className="text-red-500 mt-2 text-sm">{errorMessage}</div>
          )}
          <div className="flex gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!stripe || loading}>
              {loading ? "Processing..." : `Pay $${amount}`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
