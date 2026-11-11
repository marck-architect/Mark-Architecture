import { NextRequest, NextResponse } from "next/server";
import { resend, EMAIL_CONFIG } from "@/lib/server/email/resend";
import { saveCardContact } from "@/lib/server/cardContacts";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 },
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required" },
        { status: 400 },
      );
    }

    if (!phone || typeof phone !== "string" || !phone.trim()) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 },
      );
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    const cleanPhoneForWhatsApp = trimmedPhone.replace(/[^0-9]/g, "");
    const dateFormatted = new Intl.DateTimeFormat("en-US", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "Asia/Karachi",
    }).format(new Date());

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact via Digital Card</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f3f2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #15191e;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f6f3f2; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 580px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06); border: 1px solid #e5e2e1;">
          <!-- Gold Accent Bar -->
          <tr>
            <td height="6" style="background: linear-gradient(90deg, #c9a86e, #e8c889, #7e5714);"></td>
          </tr>
          
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 20px 32px; background-color: #15191e; color: #ffffff;">
              <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #e8c889; font-weight: 700; display: block; margin-bottom: 8px;">MARK Architects Digital Card</span>
              <h1 style="margin: 0; font-size: 22px; font-weight: 600; color: #ffffff;">New Contact Details Exchanged</h1>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #444748;">
                A new contact just clicked <strong>&ldquo;Exchange Info&rdquo;</strong> on Muhammad Arslan&apos;s digital card and shared their details:
              </p>

              <!-- Details Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #faf8f7; border: 1px solid #e5e2e1; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #e5e2e1; width: 35%; font-size: 13px; font-weight: 600; color: #15191e;">Full Name</td>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #e5e2e1; font-size: 15px; color: #15191e; font-weight: 700;">${trimmedName}</td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #e5e2e1; font-size: 13px; font-weight: 600; color: #15191e;">Email Address</td>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #e5e2e1; font-size: 14px;">
                    <a href="mailto:${trimmedEmail}" style="color: #7e5714; text-decoration: none; font-weight: 600;">${trimmedEmail}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #e5e2e1; font-size: 13px; font-weight: 600; color: #15191e;">Phone Number</td>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #e5e2e1; font-size: 14px; font-weight: 600;">
                    <a href="tel:${trimmedPhone}" style="color: #15191e; text-decoration: none;">${trimmedPhone}</a>
                    ${cleanPhoneForWhatsApp ? `&nbsp;&nbsp;<a href="https://wa.me/${cleanPhoneForWhatsApp}" style="display: inline-block; background-color: #25d366; color: #ffffff; text-decoration: none; font-size: 11px; padding: 3px 8px; border-radius: 6px; font-weight: 600;">Chat on WhatsApp</a>` : ""}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px; font-size: 13px; font-weight: 600; color: #747676;">Received At</td>
                  <td style="padding: 16px 20px; font-size: 13px; color: #747676;">${dateFormatted} (PKT)</td>
                </tr>
              </table>

              <!-- Quick Action Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" style="padding-top: 8px;">
                    <a href="mailto:${trimmedEmail}?subject=Nice%20connecting%20with%20you%20-%20Muhammad%20Arslan%20%7C%20MARK%20Architects" style="display: inline-block; background-color: #15191e; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-size: 14px; font-weight: 600;">
                      Reply to ${trimmedName}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #f6f3f2; border-top: 1px solid #e5e2e1; font-size: 12px; color: #747676; text-align: center;">
              This notification was generated from your digital business card at <a href="https://www.mark-architects.com/card" style="color: #7e5714; text-decoration: none;">www.mark-architects.com/card</a>.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    const adminEmail = process.env.ADMIN_EMAIL || "markarchitects.web@gmail.com";
    const recipients = [adminEmail];
    let emailSentSuccessfully = false;

    if (resend) {
      try {
        const { data, error } = await resend.emails.send({
          from: EMAIL_CONFIG.formattedFrom,
          to: recipients,
          replyTo: trimmedEmail,
          subject: `New Contact Shared: ${trimmedName} via Digital Card`,
          html: htmlContent,
        });

        if (error) {
          console.error("[Card Exchange Info] Resend email error:", error.message);
        } else {
          emailSentSuccessfully = true;
          console.log("[Card Exchange Info] Email sent successfully:", data?.id);
        }
      } catch (sendErr) {
        console.error("[Card Exchange Info] Send exception:", sendErr);
      }
    } else {
      console.warn("[Card Exchange Info] Resend is not configured (missing RESEND_API_KEY). Simulating send:", {
        to: recipients,
        from: trimmedEmail,
        name: trimmedName,
        phone: trimmedPhone,
      });
      emailSentSuccessfully = true;
    }

    // Persist contact lead for the Admin Dashboard
    const savedContact = await saveCardContact({
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone,
      email_sent: emailSentSuccessfully,
    });

    return NextResponse.json({
      success: true,
      message: "Information received successfully",
      contact: savedContact,
    });
  } catch (err) {
    console.error("[Card Exchange Info API] Unexpected error:", err);
    return NextResponse.json(
      { error: "Failed to process exchange info request" },
      { status: 500 },
    );
  }
}
