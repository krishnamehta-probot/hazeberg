import { draftMode } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Turns preview off and goes back to the home page, where the published
 * content is. Harmless to call when preview is not on.
 */
export async function GET(request: NextRequest) {
  (await draftMode()).disable();
  return NextResponse.redirect(new URL("/", request.url));
}
