import React from "react";
import type { Metadata } from "next";
import { PaymentCallbackView } from "@/components/payment/PaymentCallbackView";

export const metadata: Metadata = {
  title: "Payment Confirmation & Order Status | MARK Architects",
  description:
    "Safepay payment confirmation and receipt verification for MARK Architects design orders and consultation appointments.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PaymentCallbackPage() {
  return <PaymentCallbackView />;
}
