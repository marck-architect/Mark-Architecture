import "server-only";

export interface ConsultationEmailData {
  clientName: string;
  clientEmail: string;
  consultationTitle: string;
  date: string;
  startTime: string;
  endTime?: string;
  timezone?: string;
  meetingUrl: string;
  calendarEventId?: string;
  consultationId: string;
}

/**
 * Formats appointment date nicely (e.g. "Monday, September 28, 2026")
 */
function formatHumanDate(dateStr: string): string {
  try {
    // If YYYY-MM-DD
    const [year, month, day] = dateStr.split("-").map(Number);
    if (year && month && day) {
      const d = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
      return d.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      });
    }
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/**
 * Generates the production branded responsive HTML template for consultation confirmation.
 */
export function renderConsultationConfirmationHtml(
  data: ConsultationEmailData,
): string {
  const formattedDate = formatHumanDate(data.date);
  const tz = data.timezone || "Pakistan Standard Time (PKT)";
  const timeDisplay = data.endTime
    ? `${data.startTime} - ${data.endTime} ${tz}`
    : `${data.startTime} ${tz}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Architecture Consultation is Confirmed</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f7f5f4;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1c1b1b;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f7f5f4;
      padding: 40px 16px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #e7e5e4;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
    .header {
      background-color: #1c1b1b;
      color: #ffffff;
      padding: 36px 32px;
      text-align: center;
    }
    .brand-title {
      margin: 0;
      font-size: 22px;
      letter-spacing: 2px;
      font-weight: 700;
      text-transform: uppercase;
      font-family: Georgia, serif;
    }
    .brand-subtitle {
      margin: 8px 0 0;
      font-size: 11px;
      color: #c9a86e;
      letter-spacing: 3px;
      text-transform: uppercase;
      font-weight: 600;
    }
    .content {
      padding: 36px 32px;
    }
    .badge {
      display: inline-block;
      background-color: #fef3c7;
      color: #7e5714;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 6px 14px;
      border-radius: 9999px;
      border: 1px solid #fde68a;
    }
    h1 {
      margin: 20px 0 12px;
      font-size: 22px;
      font-weight: 600;
      font-family: Georgia, serif;
      color: #1c1b1b;
      line-height: 1.3;
    }
    p {
      margin: 0 0 16px;
      font-size: 15px;
      line-height: 1.6;
      color: #44403c;
    }
    .details-card {
      background-color: #fafaf9;
      border: 1px solid #e7e5e4;
      border-radius: 12px;
      padding: 20px 24px;
      margin: 28px 0;
    }
    .row {
      display: table;
      width: 100%;
      padding: 10px 0;
      border-bottom: 1px solid #f0eeec;
    }
    .row:last-child {
      border-bottom: none;
    }
    .label {
      display: table-cell;
      font-size: 13px;
      color: #78716c;
      width: 38%;
      vertical-align: top;
    }
    .value {
      display: table-cell;
      font-size: 14px;
      font-weight: 600;
      color: #1c1b1b;
      vertical-align: top;
    }
    .button-container {
      text-align: center;
      margin: 32px 0 20px;
    }
    .btn {
      display: inline-block;
      background-color: #7e5714;
      color: #ffffff !important;
      text-decoration: none;
      font-weight: 700;
      font-size: 14px;
      letter-spacing: 1px;
      text-transform: uppercase;
      padding: 16px 36px;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(126, 87, 20, 0.2);
    }
    .fallback-box {
      background-color: #f5f5f4;
      border-radius: 8px;
      padding: 14px 18px;
      margin-top: 16px;
      font-size: 12px;
      color: #57534e;
      word-break: break-all;
    }
    .fallback-box a {
      color: #7e5714;
      text-decoration: underline;
    }
    .calendar-notice {
      margin-top: 24px;
      padding: 14px 18px;
      background-color: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 8px;
      font-size: 13px;
      color: #166534;
      display: flex;
      align-items: center;
    }
    .footer {
      background-color: #fafaf9;
      border-top: 1px solid #e7e5e4;
      padding: 24px 32px;
      text-align: center;
      font-size: 12px;
      color: #a8a29e;
      line-height: 1.6;
    }
    @media only screen and (max-width: 600px) {
      .content { padding: 24px 20px; }
      .header { padding: 28px 20px; }
      .btn { width: 100%; box-sizing: border-box; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="brand-title">MARK ARCHITECTS</div>
        <div class="brand-subtitle">Digital Atelier &amp; Architectural Practice</div>
      </div>
      <div class="content">
        <div class="badge">Appointment Confirmed</div>
        <h1>Your Architecture Consultation is Confirmed</h1>
        <p>Hello ${data.clientName},</p>
        <p>Your architectural consultation session with our principal architect has been successfully confirmed. Below are your session details and your direct Google Meet video conference link.</p>

        <div class="details-card">
          <div class="row">
            <span class="label">Consultation</span>
            <span class="value">${data.consultationTitle}</span>
          </div>
          <div class="row">
            <span class="label">Date</span>
            <span class="value">${formattedDate}</span>
          </div>
          <div class="row">
            <span class="label">Time</span>
            <span class="value">${timeDisplay}</span>
          </div>
          <div class="row">
            <span class="label">Platform</span>
            <span class="value">Google Meet (Live HD Video)</span>
          </div>
        </div>

        <div class="button-container">
          <a href="${data.meetingUrl}" target="_blank" class="btn">Join Google Meet</a>
        </div>

        <div class="fallback-box">
          <strong>Meeting link:</strong> <a href="${data.meetingUrl}" target="_blank">${data.meetingUrl}</a>
        </div>

        <div class="calendar-notice">
          The consultation has also been added to your calendar and an invitation has been dispatched to ${data.clientEmail}.
        </div>

        <p style="margin-top: 28px; font-size: 13px; color: #78716c;">
          <strong>Preparation:</strong> If you have architectural drawings, site contour surveys, or municipal plot maps, please ensure they are ready to present during our video call.
        </p>

        <p style="margin-top: 24px; font-size: 14px; color: #1c1b1b;">
          Regards,<br>
          <strong>Muhammad Arsalan</strong><br>
          Principal Architect, MARK Architects
        </p>
      </div>

      <div class="footer">
        MARK Architects Atelier • Lahore | Islamabad | Karachi<br>
        Studio Hotline: +92 300 1234567 • contact@markarchitects.com<br>
        &copy; ${new Date().getFullYear()} MARK Architects. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Generates plain-text fallback version of the email.
 */
export function renderConsultationConfirmationText(
  data: ConsultationEmailData,
): string {
  const formattedDate = formatHumanDate(data.date);
  const tz = data.timezone || "Pakistan Standard Time (PKT)";
  const timeDisplay = data.endTime
    ? `${data.startTime} - ${data.endTime} ${tz}`
    : `${data.startTime} ${tz}`;

  return `Your Architecture Consultation is Confirmed

Hello ${data.clientName},

Your consultation has been successfully confirmed.

Consultation: ${data.consultationTitle}
Date: ${formattedDate}
Time: ${timeDisplay}
Meeting: Join Google Meet
Meeting link: ${data.meetingUrl}

The consultation has also been added to your calendar.

If you have architectural drawings, site contour surveys, or plot photos ready, please have them available during the video session.

Regards,
Muhammad Arsalan
Principal Architect, MARK Architects
Atelier Hotline: +92 300 1234567
contact@markarchitects.com`;
}
