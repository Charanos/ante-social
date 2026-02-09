import { Footer } from "@/components/landing/Footer";
import Image from "next/image";
import Link from "next/link";
import { IconArrowLeft, IconPhoto } from "@tabler/icons-react";

export default async function MarketingPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const title = slug[slug.length - 1]
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Simple Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <Image
                src="/ante-logo.png"
                alt="Ante Social"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-semibold text-gray-900 tracking-tight">
              Ante Social
            </span>
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-gray-600 hover:text-gray-900"
          >
            Go to Dashboard
          </Link>
        </div>
      </header>

      <main className="pt-32 pb-20 max-w-7xl mx-auto px-6">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-semibold text-gray-400 hover:text-gray-900 mb-8 transition-colors"
        >
          <IconArrowLeft className="w-4 h-4 mr-2" />
          Back IconHome
        </Link>

        <div className="prose prose-lg prose-gray">
          <h1 className="text-5xl font-semibold tracking-tight text-gray-900 mb-8">
            {title}
          </h1>

          <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm mb-8">
            <p className="lead text-xl text-gray-600 font-medium">
              This is a placeholder page for <strong>{title}</strong>. Content
              is currently being drafted by our legal and product teams.
            </p>
          </div>

          <p>
            At Ante Social, we believe in transparency and user-centric design.
            This section will soon contain detailed information regarding{" "}
            {title.toLowerCase()}.
          </p>

          <h3>What to expect here?</h3>
          <ul>
            <li>Comprehensive guidelines and policies.</li>
            <li>Clear explanations of feature mechanics.</li>
            <li>IconUser rights and responsibilities.</li>
          </ul>

          <div className="not-prose mt-12 p-6 rounded-2xl bg-blue-50 border border-blue-100 flex gap-4">
            <div className="w-1 h-auto bg-blue-500 rounded-full" />
            <div>
              <h4 className="font-semibold text-blue-900">
                Need immediate assistance?
              </h4>
              <p className="text-blue-700 text-sm mt-1">
                If you have specific questions about {title}, please contact our
                support team directly.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
