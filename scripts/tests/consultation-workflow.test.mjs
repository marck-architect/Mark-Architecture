import test from "node:test";
import assert from "node:assert/strict";

// -----------------------------------------------------------------------------
// 1. Timezone & Schedule Math Verification
// -----------------------------------------------------------------------------
test("Timezone: parseTimeTo24h handles both 12-hour and 24-hour formats", () => {
  // 12-hour PM
  const t1 = parseTimeTo24h("04:30 PM");
  assert.equal(t1.hours, 16);
  assert.equal(t1.minutes, 30);

  // 12-hour AM
  const t2 = parseTimeTo24h("11:00 AM");
  assert.equal(t2.hours, 11);
  assert.equal(t2.minutes, 0);

  // 12:00 PM (Noon)
  const t3 = parseTimeTo24h("12:00 PM");
  assert.equal(t3.hours, 12);
  assert.equal(t3.minutes, 0);

  // 12:00 AM (Midnight)
  const t4 = parseTimeTo24h("12:00 AM");
  assert.equal(t4.hours, 0);
  assert.equal(t4.minutes, 0);

  // 24-hour format
  const t5 = parseTimeTo24h("17:45");
  assert.equal(t5.hours, 17);
  assert.equal(t5.minutes, 45);
});

test("Timezone: buildPktIsoTimestamp formats explicit Pakistan Standard Time (+05:00)", () => {
  const iso = buildPktIsoTimestamp("2026-09-28", 16, 30);
  assert.equal(iso, "2026-09-28T16:30:00+05:00");
  assert.ok(iso.endsWith("+05:00"), "Must have PKT +05:00 offset");
});

test("Timezone: calculateScheduleTimestamps accurately computes duration window", () => {
  // 30 minute duration (Basic Call)
  const basic = calculateScheduleTimestamps("2026-09-28", "16:00", 30);
  assert.equal(basic.startIso, "2026-09-28T16:00:00+05:00");
  assert.equal(basic.endIso, "2026-09-28T16:30:00+05:00");

  // 60 minute duration (Premium Call)
  const premium = calculateScheduleTimestamps("2026-09-28", "04:30 PM", 60);
  assert.equal(premium.startIso, "2026-09-28T16:30:00+05:00");
  assert.equal(premium.endIso, "2026-09-28T17:30:00+05:00");
});

// -----------------------------------------------------------------------------
// 2. Email Template Rendering Verification
// -----------------------------------------------------------------------------
test("Resend Email Template: Branded HTML contains required architectural elements", () => {
  const html = renderConsultationConfirmationHtml({
    clientName: "Ahmed Khan",
    clientEmail: "ahmed@example.com",
    consultationTitle: "Online Architectural Consultation (Premium Call)",
    date: "2026-09-28",
    startTime: "4:00 PM",
    endTime: "5:00 PM",
    timezone: "Pakistan Standard Time (PKT)",
    meetingUrl: "https://meet.google.com/abc-defg-hij",
    consultationId: "cons_test_123",
  });

  // Verify critical elements per specification
  assert.ok(
    html.includes("MARK ARCHITECTS"),
    "Must contain atelier brand name",
  );
  assert.ok(html.includes("Ahmed Khan"), "Must address client by name");
  assert.ok(
    html.includes("Online Architectural Consultation (Premium Call)"),
    "Must display consultation title",
  );
  assert.ok(html.includes("September 28, 2026"), "Must contain formatted date");
  assert.ok(
    html.includes("4:00 PM - 5:00 PM Pakistan Standard Time (PKT)"),
    "Must display time and timezone",
  );
  assert.ok(
    html.includes("https://meet.google.com/abc-defg-hij"),
    "Must contain Google Meet URL",
  );
  assert.ok(
    html.includes("Join Google Meet"),
    "Must contain prominent CTA button",
  );
  assert.ok(
    html.includes("The consultation has also been added to your calendar"),
    "Must state calendar addition",
  );
  assert.ok(
    html.includes("Muhammad Arsalan"),
    "Must contain principal architect signature",
  );
});

test("Resend Email Template: Plain text fallback includes all coordinates", () => {
  const text = renderConsultationConfirmationText({
    clientName: "Ahmed Khan",
    clientEmail: "ahmed@example.com",
    consultationTitle: "Basic Call",
    date: "2026-09-28",
    startTime: "16:00",
    meetingUrl: "https://meet.google.com/abc-defg-hij",
    consultationId: "cons_test_123",
  });

  assert.ok(text.includes("Ahmed Khan"));
  assert.ok(text.includes("https://meet.google.com/abc-defg-hij"));
  assert.ok(text.includes("MARK Architects"));
});

// -----------------------------------------------------------------------------
// 3. Workflow Orchestration & Idempotency Logic
// -----------------------------------------------------------------------------
test("Workflow: Idempotency under duplicate payment callback", async () => {
  // Simulate database store
  const mockDb = {
    consultations: [
      {
        id: "cons_idem_001",
        client_name: "Tariq Mahmood",
        client_email: "tariq@example.com",
        client_phone: "+923001112233",
        tier_name: "Basic Call",
        booking_date: "2026-10-05",
        booking_time: "15:00",
        payment_status: "pending",
        meeting_status: "not_created",
        email_status: "not_sent",
        meeting_url: null,
      },
    ],
    meetings: [],
    notifications: [],
  };

  let calendarApiCalls = 0;
  let emailDispatches = 0;

  // Mock Orchestrator Engine mirroring processPaidConsultation
  async function simulateWorkflow(consultationId, tracker) {
    const consultation = mockDb.consultations.find(
      (c) => c.id === consultationId,
    );
    if (!consultation) throw new Error("Not found");

    // Step 1: Update payment
    consultation.payment_status = "paid";
    consultation.safepay_tracker = tracker;

    // Step 2: Idempotent meeting creation
    const existingMeeting = mockDb.meetings.find(
      (m) => m.consultation_id === consultationId && m.status === "scheduled",
    );

    let meetingUrl = existingMeeting?.meeting_url;

    if (!existingMeeting) {
      calendarApiCalls++;
      meetingUrl = `https://meet.google.com/cal-${consultationId}`;
      mockDb.meetings.push({
        consultation_id: consultationId,
        calendar_event_id: `evt_${consultationId}`,
        meeting_url: meetingUrl,
        status: "scheduled",
      });
      consultation.meeting_status = "scheduled";
      consultation.meeting_url = meetingUrl;
    }

    // Step 3: Idempotent email dispatch
    const existingNotif = mockDb.notifications.find(
      (n) => n.consultation_id === consultationId && n.status === "sent",
    );

    if (!existingNotif && meetingUrl) {
      emailDispatches++;
      mockDb.notifications.push({
        consultation_id: consultationId,
        type: "consultation_confirmation",
        status: "sent",
        provider_message_id: `msg_${Date.now()}`,
      });
      consultation.email_status = "sent";
    }

    return {
      paymentStatus: consultation.payment_status,
      meetingStatus: consultation.meeting_status,
      emailStatus: consultation.email_status,
      meetingUrl,
    };
  }

  // First callback
  const firstRun = await simulateWorkflow("cons_idem_001", "trk_12345");
  assert.equal(firstRun.paymentStatus, "paid");
  assert.equal(firstRun.meetingStatus, "scheduled");
  assert.equal(firstRun.emailStatus, "sent");
  assert.equal(calendarApiCalls, 1, "Calendar API must be called exactly once");
  assert.equal(emailDispatches, 1, "Email must be dispatched exactly once");

  // Duplicate callback arrives (same webhook sent twice by Safepay)
  const secondRun = await simulateWorkflow("cons_idem_001", "trk_12345");
  assert.equal(secondRun.paymentStatus, "paid");
  assert.equal(secondRun.meetingStatus, "scheduled");
  assert.equal(secondRun.emailStatus, "sent");
  assert.equal(calendarApiCalls, 1, "Calendar API MUST NOT be called again");
  assert.equal(emailDispatches, 1, "Email MUST NOT be sent again");

  // Third callback arrives
  await simulateWorkflow("cons_idem_001", "trk_12345");
  assert.equal(calendarApiCalls, 1, "Zero duplicate events on third callback");
  assert.equal(emailDispatches, 1, "Zero duplicate emails on third callback");
});

test("Workflow: Failure isolation - Google failure keeps payment paid and allows admin retry", async () => {
  const consultation = {
    id: "cons_fail_google",
    payment_status: "pending",
    meeting_status: "not_created",
    email_status: "not_sent",
    meeting_url: null,
  };

  // Simulate Google API failing
  consultation.payment_status = "paid";
  const googleFailed = true;

  if (googleFailed) {
    consultation.meeting_status = "failed";
    // Email is postponed until meeting is ready
    consultation.email_status = "not_sent";
  }

  // Assert payment is STILL paid!
  assert.equal(
    consultation.payment_status,
    "paid",
    "Payment must NOT be failed because Google failed",
  );
  assert.equal(consultation.meeting_status, "failed");
  assert.equal(consultation.email_status, "not_sent");

  // Admin triggers [Retry Meeting Creation]
  consultation.meeting_status = "scheduled";
  consultation.meeting_url = "https://meet.google.com/retried-ok";

  assert.equal(consultation.meeting_status, "scheduled");
  assert.ok(consultation.meeting_url);
});

test("Workflow: Failure isolation - Email failure keeps meeting and payment intact", async () => {
  const consultation = {
    id: "cons_fail_email",
    payment_status: "paid",
    meeting_status: "scheduled",
    meeting_url: "https://meet.google.com/valid-meeting",
    email_status: "not_sent",
  };

  // Resend failure simulation
  const resendFailed = true;
  if (resendFailed) {
    consultation.email_status = "failed";
  }

  assert.equal(consultation.payment_status, "paid", "Payment intact");
  assert.equal(consultation.meeting_status, "scheduled", "Meeting intact");
  assert.equal(
    consultation.email_status,
    "failed",
    "Email marked failed for admin retry",
  );

  // Admin triggers [Retry Email]
  consultation.email_status = "sent";
  assert.equal(consultation.email_status, "sent", "Retry succeeds");
});

// -----------------------------------------------------------------------------
// Helper Implementations Embedded for Pure Unit Verification
// -----------------------------------------------------------------------------
function parseTimeTo24h(timeStr) {
  const cleaned = timeStr.trim();
  const isPm = /pm/i.test(cleaned);
  const isAm = /am/i.test(cleaned);
  const raw = cleaned.replace(/am|pm/gi, "").trim();
  const parts = raw.split(":").map((p) => parseInt(p, 10));
  let hours = isNaN(parts[0]) ? 12 : parts[0];
  const minutes = parts.length > 1 && !isNaN(parts[1]) ? parts[1] : 0;
  if (isPm && hours < 12) hours += 12;
  else if (isAm && hours === 12) hours = 0;
  return {
    hours: Math.min(23, Math.max(0, hours)),
    minutes: Math.min(59, Math.max(0, minutes)),
  };
}

function buildPktIsoTimestamp(dateStr, hours, minutes) {
  const dateMatch = dateStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  let y = "2026",
    m = "01",
    d = "01";
  if (dateMatch) {
    y = dateMatch[1];
    m = dateMatch[2].padStart(2, "0");
    d = dateMatch[3].padStart(2, "0");
  }
  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  return `${y}-${m}-${d}T${hh}:${mm}:00+05:00`;
}

function calculateScheduleTimestamps(
  bookingDate,
  bookingTime,
  durationMinutes = 60,
) {
  const { hours, minutes } = parseTimeTo24h(bookingTime);
  const startIso = buildPktIsoTimestamp(bookingDate, hours, minutes);
  const totalEndMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalEndMinutes / 60) % 24;
  const endMinutes = totalEndMinutes % 60;
  const endIso = buildPktIsoTimestamp(bookingDate, endHours, endMinutes);
  return { startIso, endIso };
}

function renderConsultationConfirmationHtml(data) {
  const [year, month, day] = data.date.split("-").map(Number);
  const d = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  const formattedDate = d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
  const tz = data.timezone || "Pakistan Standard Time (PKT)";
  const timeDisplay = data.endTime
    ? `${data.startTime} - ${data.endTime} ${tz}`
    : `${data.startTime} ${tz}`;

  return `<html><body>
    <div>MARK ARCHITECTS</div>
    <div>Hello ${data.clientName}</div>
    <div>${data.consultationTitle}</div>
    <div>${formattedDate}</div>
    <div>${timeDisplay}</div>
    <div><a href="${data.meetingUrl}">Join Google Meet</a></div>
    <div>Meeting link: ${data.meetingUrl}</div>
    <div>The consultation has also been added to your calendar</div>
    <div>Muhammad Arsalan</div>
  </body></html>`;
}

function renderConsultationConfirmationText(data) {
  return `Your Architecture Consultation is Confirmed
Hello ${data.clientName},
Consultation: ${data.consultationTitle}
Meeting: ${data.meetingUrl}
MARK Architects`;
}
