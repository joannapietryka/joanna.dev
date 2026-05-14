import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const DEFAULT_TO = "pietrykajoanna@gmail.com";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.error("RESEND_API_KEY is missing — add it to .env.local");
    return NextResponse.json(
      {
        error:
          "Email is not configured. Add RESEND_API_KEY to your environment (e.g. .env.local).",
      },
      { status: 503 }
    );
  }

  const resend = new Resend(apiKey);

  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name : "";
    const surname = typeof body.surname === "string" ? body.surname : "";
    const email = typeof body.email === "string" ? body.email : "";
    const message = typeof body.message === "string" ? body.message : "";

    if (!name.trim() || !surname.trim() || !email.trim() || !message.trim()) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    const to = process.env.CONTACT_TO?.trim() || DEFAULT_TO;
    const from =
      process.env.RESEND_FROM?.trim() ||
      "joanna.dev Contact <onboarding@resend.dev>";

    const fullName = `${name.trim()} ${surname.trim()}`;
    const safeName = escapeHtml(fullName);
    const safeEmail = escapeHtml(email.trim());
    const safeMessage = escapeHtml(message.trim());

    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email.trim(),
      subject: `New message from ${fullName}`,
      html: `
        <div style="font-family:ui-monospace,monospace;max-width:600px;margin:0 auto;padding:40px 32px;background:#fafafa;border-radius:16px;">
          <p style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#666;margin-bottom:32px;">joanna.dev — Contact Form</p>
          <h2 style="font-size:22px;font-weight:800;color:#0a0a0a;margin-bottom:24px;letter-spacing:-0.02em;">New message from ${safeName}</h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr>
              <td style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#999;padding:12px 0 4px;">From</td>
            </tr>
            <tr>
              <td style="font-size:14px;color:#0a0a0a;padding-bottom:16px;border-bottom:1px solid #eee;">${safeName} &lt;${safeEmail}&gt;</td>
            </tr>
            <tr>
              <td style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#999;padding:16px 0 4px;">Message</td>
            </tr>
            <tr>
              <td style="font-size:14px;color:#0a0a0a;line-height:1.7;white-space:pre-wrap;">${safeMessage}</td>
            </tr>
          </table>
          <p style="font-size:11px;color:#bbb;margin-top:32px;">Reply directly to this email to respond to ${safeName}.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        {
          error:
            "Could not send email. Check Resend dashboard (domain, from address, API key).",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again or email directly." },
      { status: 500 }
    );
  }
}
