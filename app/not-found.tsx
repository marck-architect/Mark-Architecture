import Link from "next/link";
import { Compass, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FCF8F8] text-[#1C1B1B] flex flex-col items-center justify-center px-4 py-16 selection:bg-amber-100 selection:text-amber-900">
      {/* Background Architectural Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="relative max-w-md w-full bg-white border border-stone-200 rounded-2xl shadow-xl shadow-stone-200/50 p-8 md:p-10 text-center z-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[#7E5714] mb-6 shadow-2xs">
          <Compass className="w-7 h-7" />
        </div>

        <span className="text-[11px] uppercase tracking-[0.25em] text-[#7E5714] font-semibold block mb-2">
          404 — Spatial Absence
        </span>

        <h1 className="font-playfair text-2xl md:text-3xl text-stone-900 font-normal mb-3">
          Page Not Found
        </h1>

        <p className="text-xs text-stone-600 mb-8 leading-relaxed">
          The requested architectural blueprint, perspective, or link does not
          exist within the current MARK Architects archives.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/"
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#7E5714] hover:bg-[#684710] text-white text-xs font-medium transition-all shadow-xs cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </Link>

          <Link
            href="/collection"
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium border border-stone-200 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Collections</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
