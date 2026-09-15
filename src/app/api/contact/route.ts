import { NextResponse } from "next/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactPayload = Record<"name" | "email" | "subject" | "message" | "website", unknown>;

function isValidText(value: unknown, maximumLength: number): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= maximumLength;
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const recipient = process.env.RESEND_TO_EMAIL;

  if (!apiKey || !from || !recipient) {
    console.error("[Contact] Resend environment variables are not configured.");
    return NextResponse.json({ error: "The contact service is not configured yet." }, { status: 503 });
  }

  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (typeof body.website === "string" && body.website.trim()) return NextResponse.json({ success: true });

  if (!isValidText(body.name, 120) || !isValidText(body.email, 254) || !isValidText(body.subject, 180) || !isValidText(body.message, 5000) || !EMAIL_PATTERN.test(body.email.trim())) {
    return NextResponse.json({ error: "Please complete all fields with valid information." }, { status: 400 });
  }

  const name = body.name.trim();
  const email = body.email.trim();
  const subject = body.subject.trim();
  const message = body.message.trim();

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [recipient], reply_to: email, subject: `[MITSU Contact] ${subject}`, text: `New contact message from MITSU\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}` }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      console.error("[Contact] Resend rejected the email.", { status: response.status, response: await response.text() });
      return NextResponse.json({ error: "We couldn't send your message. Please try again shortly." }, { status: 502 });
    }
  } catch (error) {
    console.error("[Contact] Failed to send email.", error);
    return NextResponse.json({ error: "We couldn't send your message. Please try again shortly." }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
