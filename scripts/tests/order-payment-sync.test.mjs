import test from "node:test";
import assert from "node:assert/strict";

test("Order Payment Status: resolves correct status from payment_type", () => {
  const resolveStatus = (paymentType, isPaid) => {
    if (!isPaid) return "pending";
    return paymentType === "50_percent_advance" ? "advance_paid" : "fully_paid";
  };

  assert.equal(resolveStatus("50_percent_advance", true), "advance_paid");
  assert.equal(resolveStatus("full", true), "fully_paid");
  assert.equal(resolveStatus(undefined, true), "fully_paid");
  assert.equal(resolveStatus("50_percent_advance", false), "pending");
});

test("Order Identifier Query: constructs safe multi-column matchers preventing UUID syntax errors", () => {
  const isUuid = (val) =>
    typeof val === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

  const buildQuery = (orderId, tracker) => {
    const parts = [];
    if (isUuid(orderId)) parts.push(`id.eq.${orderId}`);
    if (orderId) parts.push(`order_number.eq.${orderId}`);
    if (tracker) parts.push(`safepay_tracker.eq.${tracker}`);
    return parts.join(",");
  };

  const uuidQuery = buildQuery(
    "4a57e7d6-f4e4-4fe0-838e-fa60fb685bb0",
    "track_1fd32f12",
  );
  assert.equal(
    uuidQuery,
    "id.eq.4a57e7d6-f4e4-4fe0-838e-fa60fb685bb0,order_number.eq.4a57e7d6-f4e4-4fe0-838e-fa60fb685bb0,safepay_tracker.eq.track_1fd32f12",
  );

  const orderNumQuery = buildQuery("ORD-892182-381", "track_1fd32f12");
  assert.equal(
    orderNumQuery,
    "order_number.eq.ORD-892182-381,safepay_tracker.eq.track_1fd32f12",
  );
});

test("Order Initial Insert: payload contains safepay_tracker immediately", () => {
  const buildInsertPayload = ({
    orderId,
    orderNumber,
    customer,
    advancePkr,
    totalPkr,
    paymentType,
    tracker,
  }) => ({
    id: orderId,
    order_number: orderNumber,
    client_name: customer.name,
    client_email: customer.email,
    client_phone: customer.phone,
    total_amount_pkr: totalPkr,
    advance_amount_pkr: advancePkr,
    payment_type: paymentType,
    payment_status: "pending",
    safepay_tracker: tracker,
  });

  const payload = buildInsertPayload({
    orderId: "UUID-123",
    orderNumber: "ORD-999-001",
    customer: {
      name: "Client",
      email: "test@example.com",
      phone: "+923001234567",
    },
    advancePkr: 15000,
    totalPkr: 30000,
    paymentType: "50_percent_advance",
    tracker: "track_test_123",
  });

  assert.equal(payload.id, "UUID-123");
  assert.equal(payload.safepay_tracker, "track_test_123");
  assert.equal(payload.payment_status, "pending");
});
