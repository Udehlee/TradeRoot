import { ablyServer } from "@/app/lib/ably-server";
import { getServerSession } from "@/app/lib/get-session";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const tokenRequest = await ablyServer.auth.createTokenRequest({
    clientId: session.user.id,
  });

  return NextResponse.json(tokenRequest);
}