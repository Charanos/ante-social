import { Suspense } from "react";
import CheckoutContent from "./CheckoutContent";
import { LoadingLogo } from "@/components/ui/LoadingLogo";

export const metadata = {
  title: "Ante Social | Checkout",
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={<LoadingLogo />}>
      <CheckoutContent />
    </Suspense>
  );
}
