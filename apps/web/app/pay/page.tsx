import { Metadata } from "next";
import Link from "next/link";
import { PayCheckout } from "@/components/pay/PayCheckout";
import { getSiteUrlString } from "@/lib/site-url";

const PATH = "/pay";

export async function generateMetadata(): Promise<Metadata> {
  const base = getSiteUrlString();
  return {
    title: "Pay online",
    description: "Pay securely in INR via Razorpay (UPI, cards, netbanking where supported).",
    alternates: { canonical: `${base}${PATH}` },
  };
}

export default function PayPage() {
  const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim();

  return (
    <div className="page-marketing page-section-y">
      <div className="page-narrow max-w-lg">
        <h1 className="font-display text-3xl font-normal tracking-tight text-foreground sm:text-4xl">Pay online</h1>
        <p className="mt-3 text-muted-foreground">
          Use this page to pay an agreed amount (retainer, milestone, or invoice). Enter the amount your team shared with
          you — do not guess if you are unsure.
        </p>

        {!key ? (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
            <p className="font-medium">Payments are not enabled in this environment.</p>
            <p className="mt-1 text-amber-900/90 dark:text-amber-200/90">
              Set <code className="rounded bg-amber-100/80 px-1 dark:bg-amber-900/60">NEXT_PUBLIC_RAZORPAY_KEY_ID</code>{" "}
              on the website and <code className="rounded bg-amber-100/80 px-1 dark:bg-amber-900/60">RAZORPAY_KEY_ID</code>{" "}
              / <code className="rounded bg-amber-100/80 px-1 dark:bg-amber-900/60">RAZORPAY_KEY_SECRET</code> on the API,
              then redeploy.
            </p>
          </div>
        ) : (
          <PayCheckout razorpayKeyId={key} />
        )}

        <p className="mt-8 text-sm text-muted-foreground">
          <Link href="/contact" className="underline underline-offset-2 hover:text-foreground">
            Contact us
          </Link>{" "}
          if you need a formal invoice before paying.
        </p>
      </div>
    </div>
  );
}
