import { NextResponse } from "next/server";

export const runtime = "nodejs";

const TO_EMAIL = "reonustudio@gmail.com";

type ContactPayload = {
  name?: string;
  company?: string;
  scope?: string;
  content?: string;
  budget?: string;
  timing?: string;
  email?: string;
  agree?: boolean;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "RESEND_API_KEY is not configured." },
      { status: 500 }
    );
  }

  let body: ContactPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, company, scope, content, budget, timing, email, agree } = body;

  // Server-side validation mirrors the client-side checks
  if (!name?.trim() || !content?.trim() || !email?.trim() || !agree) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const rows: [string, string | undefined][] = [
    ["이름", name],
    ["회사 / 브랜드", company],
    ["의뢰 분야", scope],
    ["예산", budget],
    ["희망 시기", timing],
    ["이메일", email],
  ];

  const htmlRows = rows
    .filter(([, value]) => value && value.trim())
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px;color:#86868B;font-weight:600;white-space:nowrap;vertical-align:top;">${escapeHtml(
          label
        )}</td><td style="padding:6px 12px;color:#1D1D1F;">${escapeHtml(value as string)}</td></tr>`
    )
    .join("");

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#1D1D1F;">새로운 문의가 도착했습니다</h2>
      <table style="border-collapse:collapse;width:100%;margin-bottom:16px;">${htmlRows}</table>
      <div>
        <div style="color:#86868B;font-weight:600;margin-bottom:6px;">프로젝트 내용</div>
        <div style="white-space:pre-wrap;color:#1D1D1F;border:1px solid #F5F5F7;border-radius:8px;padding:12px;">${escapeHtml(
          content
        )}</div>
      </div>
    </div>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "REONU Studio <onboarding@resend.dev>",
        to: [TO_EMAIL],
        reply_to: email,
        subject: `[Let's Talk] ${name}님의 새로운 문의`,
        html,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error("Resend error:", errBody);
      return NextResponse.json({ error: "Failed to send email." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form send error:", err);
    return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
  }
}
