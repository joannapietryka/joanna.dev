import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const TO = "pietrykajoanna@gmail.com";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
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

    const { error } = await resend.emails.send({
      from: "joanna.dev Contact <onboarding@resend.dev>",
      to: TO,
      replyTo: email,
      subject: `New message from ${name}`,
      html: `
        <div style="font-family:ui-monospace,monospace;max-width:600px;margin:0 auto;padding:40px 32px;background:#fafafa;border-radius:16px;">
          <p style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#666;margin-bottom:32px;">joanna.dev — Contact Form</p>
          <h2 style="font-size:22px;font-weight:800;color:#0a0a0a;margin-bottom:24px;letter-spacing:-0.02em;">New message from ${name}</h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr>
              <td style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#999;padding:12px 0 4px;">From</td>
            </tr>
            <tr>
              <td style="font-size:14px;color:#0a0a0a;padding-bottom:16px;border-bottom:1px solid #eee;">${name} &lt;${email}&gt;</td>
            </tr>
            <tr>
              <td style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#999;padding:16px 0 4px;">Message</td>
            </tr>
            <tr>
              <td style="font-size:14px;color:#0a0a0a;line-height:1.7;white-space:pre-wrap;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</td>
            </tr>
          </table>
          <p style="font-size:11px;color:#bbb;margin-top:32px;">Reply directly to this email to respond to ${name}.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send message. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
