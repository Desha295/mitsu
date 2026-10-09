import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function tokenId(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function POST(request: NextRequest) {
  let stage = "request";
  try {
    const authorization = request.headers.get("authorization");
    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    stage = "firebase-admin-init";
    const { adminAuth, adminDb } = getFirebaseAdmin();
    stage = "id-token-verification";
    const user = await adminAuth.verifyIdToken(authorization.slice(7).trim());
    const body = await request.json();
    const action = body?.action;
    const token = typeof body?.token === "string" ? body.token.trim() : "";

    if (!token || token.length > 4096 || (action !== "subscribe" && action !== "unsubscribe")) {
      return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
    }

    const ref = adminDb.collection("pushSubscriptions").doc(tokenId(token));
    if (action === "subscribe") {
      stage = "firestore-subscription-write";
      await ref.set({ token, ownerUid: user.uid, enabled: true, updatedAt: new Date() });
    } else {
      stage = "firestore-subscription-delete";
      const existing = await ref.get();
      if (existing.exists && existing.get("ownerUid") === user.uid) {
        await ref.delete();
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const code = typeof error === "object" && error !== null && "code" in error
      ? String((error as { code?: unknown }).code || "UNKNOWN")
      : "UNKNOWN";
    const status = stage === "id-token-verification" ? 401 : 500;
    console.error("[MITSU] Push subscription update failed", { stage, code });
    return NextResponse.json(
      { error: "Subscription update failed", stage, code },
      { status }
    );
  }
}
