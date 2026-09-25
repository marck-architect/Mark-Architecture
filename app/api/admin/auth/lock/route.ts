import { NextResponse } from "next/server";
import { GATEKEEPER_COOKIE_NAME } from "@/lib/server/adminGatekeeper";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Admin portal session locked.",
  });

  // Clear the gatekeeper cookie
  response.cookies.set(GATEKEEPER_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
