import "server-only";

export interface OrderEmailData {
  clientName: string;
  clientEmail: string;
  orderNumber: string;
  orderId: string;
  amountPkr: number;
  orderUrl: string;
}

function formatPKR(n: number): string {
  return `PKR ${Math.round(n).toLocaleString("en-PK")}`;
}

/** Branded order-received email — matches the consultation confirmation template's style. */
export function renderOrderConfirmationHtml(data: OrderEmailData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Received - MARK Architects</title>
  <style>
    body { margin:0; padding:0; background-color:#f7f5f4; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#1c1b1b; -webkit-font-smoothing:antialiased; }
    .wrapper { width:100%; background-color:#f7f5f4; padding:40px 16px; }
    .container { max-width:600px; margin:0 auto; background-color:#ffffff; border-radius:16px; overflow:hidden; border:1px solid #e7e5e4; box-shadow:0 4px 12px rgba(0,0,0,0.05); }
    .header { background-color:#1c1b1b; color:#ffffff; padding:36px 32px; text-align:center; }
    .header h1 { margin:0; font-size:20px; font-weight:700; letter-spacing:.02em; }
    .body { padding:32px; }
    .amount-box { background-color:#faf5ec; border:1px solid #e9dcc3; border-radius:12px; padding:20px; text-align:center; margin:20px 0; }
    .amount-box .label { font-size:11px; text-transform:uppercase; letter-spacing:.1em; color:#7e5714; font-weight:700; }
    .amount-box .amount { font-size:28px; font-weight:800; color:#1c1b1b; margin-top:4px; }
    .button { display:inline-block; background-color:#7e5714; color:#ffffff !important; text-decoration:none; padding:14px 28px; border-radius:10px; font-weight:700; font-size:13px; letter-spacing:.04em; text-transform:uppercase; margin-top:8px; }
    .footer { padding:24px 32px; text-align:center; font-size:11px; color:#8a8580; border-top:1px solid #f0eeec; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header"><h1>MARK ARCHITECTS</h1></div>
      <div class="body">
        <p>Hi ${data.clientName},</p>
        <p>We've received your order and your payment screenshot. Our team is verifying the payment now — this usually takes a few hours.</p>
        <div class="amount-box">
          <div class="label">Order ${data.orderNumber}</div>
          <div class="amount">${formatPKR(data.amountPkr)}</div>
        </div>
        <p>Bookmark this link — it always shows your current payment status, and once confirmed you can download your receipt from the same page:</p>
        <p style="text-align:center;">
          <a class="button" href="${data.orderUrl}">Track Order &amp; Download Receipt</a>
        </p>
        <p style="font-size:12px;color:#6b6560;">Or copy this link: ${data.orderUrl}</p>
      </div>
      <div class="footer">MARK Architects &middot; This is an automated message regarding order ${data.orderNumber}.</div>
    </div>
  </div>
</body>
</html>`;
}

export function renderOrderConfirmationText(data: OrderEmailData): string {
  return `Hi ${data.clientName},

We've received your order (${data.orderNumber}) for ${formatPKR(data.amountPkr)} and your payment screenshot. Our team is verifying the payment now.

Track your order status and download your receipt here once confirmed:
${data.orderUrl}

- MARK Architects`;
}
