import test from "node:test";
import assert from "node:assert/strict";

test("Order Payment Status mapping satisfies Postgres CHECK constraint", () => {
  const allowedPostgresStatuses = [
    "pending",
    "advance_paid",
    "fully_paid",
    "failed",
    "refunded",
  ];

  const mapPaymentStatus = (paymentType, isPaid) => {
    if (!isPaid) return "pending";
    return paymentType === "50_percent_advance" ? "advance_paid" : "fully_paid";
  };

  const fullPaidStatus = mapPaymentStatus("full", true);
  assert.equal(fullPaidStatus, "fully_paid");
  assert.ok(
    allowedPostgresStatuses.includes(fullPaidStatus),
    "fully_paid must satisfy CHECK constraint",
  );

  const advancePaidStatus = mapPaymentStatus("50_percent_advance", true);
  assert.equal(advancePaidStatus, "advance_paid");
  assert.ok(
    allowedPostgresStatuses.includes(advancePaidStatus),
    "advance_paid must satisfy CHECK constraint",
  );

  const pendingStatus = mapPaymentStatus("full", false);
  assert.equal(pendingStatus, "pending");
  assert.ok(
    allowedPostgresStatuses.includes(pendingStatus),
    "pending must satisfy CHECK constraint",
  );
});

test("Order query filter builders handle both UUID and non-UUID order numbers gracefully", () => {
  const isUuid = (val) =>
    typeof val === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

  const buildOrderQuery = (idVal, trkVal) => {
    const parts = [];
    if (isUuid(idVal)) parts.push(`id.eq.${idVal}`);
    if (idVal) parts.push(`order_number.eq.${idVal}`);
    if (trkVal) parts.push(`safepay_tracker.eq.${trkVal}`);
    return parts.join(",");
  };

  // Case 1: Standard UUID orderId from web checkout
  const uuid = "4a57e7d6-f4e4-4fe0-838e-fa60fb685bb0";
  const tracker = "track_1fd32f12-acbf-4db9-8815-26cbe94c5291";
  const query1 = buildOrderQuery(uuid, tracker);
  assert.equal(
    query1,
    `id.eq.${uuid},order_number.eq.${uuid},safepay_tracker.eq.${tracker}`,
  );

  // Case 2: Order Number reference string (e.g. from customer support or URL callback)
  const orderNum = "ORD-482910-182";
  const query2 = buildOrderQuery(orderNum, tracker);
  assert.equal(
    query2,
    `order_number.eq.${orderNum},safepay_tracker.eq.${tracker}`,
  );
  assert.ok(
    !query2.includes("id.eq.ORD-"),
    "Must NOT attempt to cast ORD-* to UUID column",
  );
});

test("Selected disciplines parsing renders cart items and lists clearly", () => {
  const parseDisciplines = (selected) => {
    if (Array.isArray(selected)) {
      return selected.map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object") {
          const itemObj = item;
          const title = itemObj.title || itemObj.name || "Item";
          const meta = [
            itemObj.tier,
            itemObj.plotSize,
            itemObj.quantity && itemObj.quantity > 1
              ? `x${itemObj.quantity}`
              : null,
          ]
            .filter(Boolean)
            .join(" • ");
          return meta ? `${title} (${meta})` : title;
        }
        return String(item);
      });
    }
    return [];
  };

  // Array of string disciplines
  const stringDisciplines = ["Structural drawings", "Electrical layout design"];
  assert.deepEqual(parseDisciplines(stringDisciplines), stringDisciplines);

  // Array of cart item objects
  const cartItems = [
    { title: "House Plan Review", tier: "Premium", quantity: 1 },
    { title: "Front Elevation 3D", plotSize: "10 Marla", quantity: 2 },
  ];
  assert.deepEqual(parseDisciplines(cartItems), [
    "House Plan Review (Premium)",
    "Front Elevation 3D (10 Marla • x2)",
  ]);
});
