import { NextResponse } from "next/server";
import { getPublicTestimonials } from "@/lib/server/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const testimonials = await getPublicTestimonials();
    return NextResponse.json(
      {
        success: true,
        data: testimonials,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Error in /api/testimonials:", errorMsg);
    return NextResponse.json(
      {
        success: false,
        data: [],
        error: errorMsg,
      },
      { status: 500 },
    );
  }
}
