import { NextResponse } from "next/server";
import { getPublicFaqs } from "@/lib/server/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const data = await getPublicFaqs();
    return NextResponse.json(
      {
        success: true,
        data,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Error in /api/faqs:", errorMsg);
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
