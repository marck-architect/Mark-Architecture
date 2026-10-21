# Products Catalog & Manual Payment System — Developer Handoff

This document is a complete technical reference for the **Products/Collection catalog** and the **manual payment checkout system** (bank transfer / JazzCash — there is no payment gateway). It exists so another developer, or their AI coding assistant, can read this one file and work on the admin panel or extend the system **without exploring the codebase first**.

Everything described as "already built" is live and working in this repo right now. The "Not Yet Built" section at the bottom is the only part that needs new work.

---

## 1. High-Level Architecture

- **Framework:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- **Database:** Supabase (Postgres)
- **State:** Zustand (`hooks/useStore.ts`), persisted to `localStorage` for cart/confirmed-orders
- **Payments:** No gateway. Customer pays via **Askari Bank transfer** or **JazzCash**, uploads a screenshot as proof, admin manually verifies and flips the order's `payment_status`.
- **Email:** Resend API (`lib/server/email/`), already configured for consultation confirmations; order confirmations reuse the same pattern.
- **File uploads:** Generic endpoint `POST /api/upload` (Sharp-optimized, Supabase Storage), used for product images, payment screenshots, and architectural plan attachments alike.

---

## 2. Data Model

### 2.1 Product Catalog (hardcoded structure, not admin-editable)

`data/productCatalog.ts` exports `productCategories: ProductCategory[]` — exactly **8 categories**, each with a fixed `subcategories: string[]` list supplied by the client. This structure (category list, subcategory names, category hero/tile images, band colors) is **not** meant to be admin-editable — it's code, not CMS content.

```ts
export interface ProductCategory {
  id: string;            // e.g. "lighting", "kitchen-bath"
  title: string;
  subtitle: string;
  image: string;          // category tile image, /public/images/shop/categories/*.jpg
  heroImage?: string;     // falls back to `image` if unset
  bandColor: string;      // hex, sampled from the hero photo, used as the hero section's background
  subcategories: string[];
}
```

The 8 category ids (do not rename — they're used as keys everywhere): `lighting`, `furniture`, `home-decor`, `tiles-finishes`, `kitchen-bath`, `exterior`, `garden-landscape`, `shop-the-look`.

### 2.2 Store Products (admin-editable — this is "the products")

```ts
// types.d.ts
export interface StoreProduct {
  id: string;
  category_id: string;      // must match a ProductCategory.id above
  subcategory: string;      // must match one of that category's subcategories[] strings exactly
  name: string;
  price_pkr: number;
  price_unit?: string;      // e.g. "sq.ft" — appended as "/ sq.ft" in the UI
  image_url: string;        // empty string = falls back to the category's line icon as a placeholder
  description?: string;
  is_published: boolean;
  display_order: number;
}
```

**Storage:** Products are stored as a single JSON array under `site_content.section_key = "store_products"` (same generic CMS table used for other site content, not a dedicated `store_products` table). A local file cache at `data/store_products.json` is also written on every admin write as a fast-path fallback. If neither has data yet, the app falls back to the hardcoded seed in `data/storeProducts.ts` (`defaultStoreProducts`, 71 entries — one per subcategory, so every category/subcategory has at least one product and nothing ever shows empty).

**Public read path:** `getSiteContent<StoreProduct[]>("store_products", defaultStoreProducts)` from `lib/server/content.ts`, called in `app/collection/page.tsx` and `app/collection/[category]/page.tsx`.

### 2.3 Orders

```ts
// types.d.ts — fields actually used by the current checkout flow
export interface OrderRecord {
  id: string;                          // UUID, also the public order-tracking URL token
  order_number: string;                // e.g. "ORD-123456-789", human-friendly reference
  client_name: string;
  client_email: string;
  client_phone: string;
  plot_size?: string | null;
  covered_area_sqft?: number | null;
  selected_disciplines?: ...;          // actually holds the cart line items array: {title, price, quantity, tier?, plotSize?}[]
  total_amount_pkr: number;
  advance_amount_pkr: number;          // the amount actually charged now (50% if advance order, else = total)
  remaining_balance_pkr: number;
  payment_type: string;                // "full" | "50_percent_advance"
  payment_status: string;              // "pending" | "advance_paid" | "fully_paid" | "paid" | "refunded" | "failed"
  attachment_urls?: string[];          // last element is ALWAYS the payment screenshot (see §4)
  notes?: string | null;
  created_at: string;
  updated_at?: string;
}
```

Table: `orders` (real Supabase table, not `site_content`). Inserted by `app/api/checkout/order/route.ts`.

**Convention:** `attachment_urls` is a flat array. Any optional file the customer attached (e.g. a blueprint) is pushed first, and the **payment screenshot is always pushed last** — so `attachment_urls[attachment_urls.length - 1]` is always the payment proof. Every admin UI that shows "Payment Proof" relies on this convention.

### 2.4 Consultations

Same shape/idea as orders but for the booking flow (`consultations` table, `app/api/checkout/consultation/route.ts`). Key fields: `tier_name`, `price_pkr`, `booking_date`, `booking_time`, `attachment_urls` (plan attachment + payment screenshot, same last-element convention), `payment_status`.

---

## 3. Subcategory Icon System

Each of the 8 categories has its own hand-built, hover-animated SVG icon set for its subcategories, converted into React components:

```
components/collection/LightingSubcategoryIcons.tsx
components/collection/FurnitureSubcategoryIcons.tsx
components/collection/HomeDecorSubcategoryIcons.tsx
components/collection/TilesFinishesSubcategoryIcons.tsx
components/collection/KitchenBathSubcategoryIcons.tsx
components/collection/ExteriorSubcategoryIcons.tsx
components/collection/ShopTheLookSubcategoryIcons.tsx
components/collection/GardenLandscapeSubcategoryIcons.tsx
```

Each file exports:
- One React component per subcategory icon (named `<SubcategoryName>Icon`)
- A shared `<XxxIconStyles />` component (one `<style>` tag with the hover-animation CSS, rendered once per page)
- A map: `xxxSubcategoryIconMap: Record<string, React.FC<SVGProps<SVGSVGElement>>>` keyed by the **exact subcategory string** from `productCatalog.ts`

These are registered in `components/collection/CategoryDetailView.tsx`:

```ts
const subcategoryIconMaps: Record<string, Record<string, ...>> = {
  lighting: lightingSubcategoryIconMap,
  furniture: furnitureSubcategoryIconMap,
  "home-decor": homeDecorSubcategoryIconMap,
  "tiles-finishes": tilesFinishesSubcategoryIconMap,
  "kitchen-bath": kitchenBathSubcategoryIconMap,
  exterior: exteriorSubcategoryIconMap,
  "shop-the-look": shopTheLookSubcategoryIconMap,
  "garden-landscape": gardenLandscapeSubcategoryIconMap,
};
const subcategoryIconStyles: Record<string, React.FC> = { /* same keys, Styles components */ };
```

If a category has no entry in `subcategoryIconMaps`, the page falls back to plain text pill badges automatically — **this system is already complete for all 8 categories**, no gaps.

**Icon pattern convention** (important if ever adding a 9th category or regenerating icons): every icon component must spread `{...p}` **before** any hardcoded `className`, merging with `[baseClass, p.className].filter(Boolean).join(" ")` — never `className="x" {...p}`, because the spread silently overwrites a className that comes before it in JSX (duplicate props, last wins). This bug has bitten this codebase before.

---

## 4. Manual Payment & Checkout Flow

### 4.1 Shared payment UI

`components/payment/ManualPaymentDetails.tsx` — presentational component, shows both payment methods side by side:
- **Askari Bank**: QR code image (`/public/images/payment/askari-bank-qr.png`), IBAN `PK16ASCM0007550200010044`, account title "Mark Architects", copy-to-clipboard buttons
- **JazzCash**: QR code image (`/public/images/payment/jazzcash-qr.png`), number `0344 9240884`, account title "Muhammad Arslan", copy-to-clipboard buttons

Props: `{ amountLabel: string }`. Used identically in the cart checkout page, the direct-buy modal, and the consultation booking flow.

### 4.2 Checkout surfaces (3 of them, all converge on the same backend pattern)

| Surface | File | Trigger |
|---|---|---|
| Cart (multi-item) | `app/checkout/page.tsx` | "Proceed to Checkout" in `CartDrawer.tsx` → `router.push("/checkout")` |
| Direct single-package buy | `components/collection/DirectCheckoutModal.tsx` | "Direct Order" button on a service package |
| Consultation booking | `components/consultation/ConsultationView.tsx` (inline step, not a separate page) | Booking form submit |

All three follow the same 2-step pattern: **(1) collect contact details → (2) show `<ManualPaymentDetails>` + mandatory screenshot upload → submit.**

Screenshot upload: `POST /api/upload` with `FormData` fields `file` + `folder: "payment-proofs"`. Returns `{ url, processedSize, isImage, mimeType }`. The returned `url` is passed as `paymentScreenshotUrl` to the checkout API.

### 4.3 Checkout API routes

**`POST /api/checkout/order`** (`app/api/checkout/order/route.ts`)
```ts
// Request body
{
  customer: { name: string; email: string; phone: string };
  items: CartItem[];               // { title, price, quantity, image, tier?, plotSize? }
  paymentType?: "full" | "50_percent_advance";
  coveredAreaSqft?: number;
  selectedDisciplines?: unknown;
  notes?: string;
  attachmentUrls?: string[];       // optional extra attachments (e.g. blueprint)
  paymentScreenshotUrl: string;    // REQUIRED — 400 if missing
}
// Response
{ success: true, orderNumber: string, orderId: string, chargedAmount: number, totalAmount: number }
```
Inserts into `orders` with `payment_status: "pending"` always (never auto-marks paid), `attachment_urls: [...attachmentUrls, paymentScreenshotUrl]`. Then fires `sendOrderConfirmation(...)` (§5) — failure there is logged but non-fatal, the order still succeeds.

**`POST /api/checkout/consultation`** (`app/api/checkout/consultation/route.ts`) — same idea for the `consultations` table, also requires `paymentScreenshotUrl`, no confirmation email wired yet (see §7).

### 4.4 Order tracking (customer-facing, no login required)

| Route | Purpose |
|---|---|
| `GET /orders/[id]` | Status + receipt page. Shows "Pending Verification" (amber) / "Payment Confirmed" (green) / "Payment Not Verified" (red) based on `payment_status`. When confirmed, shows a **Download Receipt (PDF)** button that calls `window.print()` against print-only CSS scoped to `#receipt` — no PDF library needed. |
| `GET /orders/track` | Manual lookup form: order number + email/phone → finds the order → redirects to `/orders/[id]`. For customers who lost the link/email. |
| `GET /api/orders/[id]` | Public API, returns a safe field subset of one order by UUID. The UUID itself is the access token (same trust model as any order-confirmation link). |
| `POST /api/orders/lookup` | `{ orderNumber, contact }` → finds the order by `order_number` and confirms `contact` matches `client_email` or `client_phone` → `{ orderId }`. Powers the track page. |

The order UUID is also saved into `useStore().confirmedOrders` (Zustand, `localStorage`-persisted) right after checkout, so the Cart Drawer's "Confirmed Orders" tab shows it too, with a tap-through to `/orders/[id]`. This is a convenience layer only — the email + track-page paths are the durable ones.

---

## 5. Email Confirmations

`lib/server/email/`
```
resend.ts                          — Resend client + EMAIL_CONFIG (from/reply-to), already configured
orderEmailService.ts               — sendOrderConfirmation(data): sends once, no dedupe needed (fired once per order creation)
templates/order-confirmation.ts    — renderOrderConfirmationHtml/Text(data)
emailService.ts                    — sendConsultationConfirmation(params): the OLDER consultation-booking email, has idempotency
                                      tracking via a `notifications` table (consultation_id + type), used when a Google Meet link is sent
```

`RESEND_API_KEY` env var: if unset, both services **simulate** a send (log + return success) — safe for local dev, nothing breaks.

**Order email** is fired synchronously inside `POST /api/checkout/order` right after the DB insert, containing a branded HTML email with the order number, amount, and a button linking to `${origin}/orders/{id}`. No admin-confirmation email yet (see §7).

---

## 6. Admin Panel — What Already Exists

Admin lives at `/markarchit/admin` (`components/admin/AdminDashboardView.tsx`, tab-based, sidebar in `components/admin/layout/AdminSidebar.tsx`).

| Sidebar tab (`id`) | Component | What it does |
|---|---|---|
| `store-products` | `components/admin/store/StoreProductsManager.tsx` | Full CRUD for `StoreProduct`s: category dropdown (from `productCategories`), subcategory dropdown (dependent on category — only shows that category's valid subcategory strings), name, price, price_unit, description, `is_published` toggle, `display_order`, image upload via `ImageUploadField` (reuses `/api/upload`). Backed by `/api/admin/store-products` (GET/POST) and `/api/admin/store-products/[id]` (PATCH/PUT/DELETE). **This is fully built — adding/editing/removing products needs no new code.** |
| `orders` | `components/admin/orders/OrdersManager.tsx` + `OrderDetailModal.tsx` | List/search/filter orders, CSV export (includes a "Payment Proof" column = the screenshot URL). Detail modal shows full order info, an **Attachments** section (clickable links, screenshot included), and a **Payment Status** `<select>` (`pending` / `advance_paid` / `fully_paid` / `paid` / `refunded` / `failed`) with quick-set buttons — saving PATCHes `/api/admin/orders/[id]`. **This is how admin "confirms payment" today: open the order, look at the attached screenshot, set status, save.** |
| `consultations` | `components/admin/consultations/ConsultationsManager.tsx` + `components/admin/BookingDetailModal.tsx` | Same idea for consultation bookings. |
| `payments` | `components/admin/payments/PaymentsManager.tsx` | Unified ledger across both orders + consultations: KPI cards (captured revenue, pending, with-proof count, success rate), filterable table, CSV export, a receipt-preview modal with a "Payment Proof → View screenshot" link. Read-only reporting view, not where status gets changed (that's still per-order/consultation). |
| `settings` | `components/admin/settings/SettingsManager.tsx` | Has a **"Manual Payment Methods"** card showing the exact Askari Bank IBAN / JazzCash number displayed to customers (reference only, hardcoded — editing it here does **not** change what customers see; see §7 if you want that to be live-editable). |

**Auth:** all admin routes go through `requireAdminAuth()` (`lib/server/adminAuth.ts`) or the cookie/gatekeeper check pattern seen in `app/api/admin/orders/[id]/route.ts` — copy whichever pattern the neighboring route in the same folder uses.

---

## 7. Not Yet Built (the actual gaps, if extending this)

Everything above is live. These are genuine opportunities, not bugs:

1. **No "payment confirmed" email to the customer.** Right now, when admin flips `payment_status` to paid/confirmed in `OrderDetailModal.tsx` / `BookingDetailModal.tsx`, nothing notifies the customer — they'd only find out by revisiting `/orders/[id]`. Add a second email template (`templates/order-confirmed.ts`) and fire it from the admin PATCH route (`app/api/admin/orders/[id]/route.ts`) when `payment_status` transitions into a confirmed state.
2. **Consultations have no `/orders/[id]`-equivalent status page.** Only orders got the tracking page + track-by-lookup flow. Consultations still rely on the Google Meet confirmation email only. Could reuse the same pattern (a `consultations` table is already structurally identical).
3. **"Manual Payment Methods" in Settings is display-only.** The actual bank/JazzCash details shown to customers are hardcoded in `components/payment/ManualPaymentDetails.tsx`, not read from `SettingsManager.tsx`'s UI. To make them live-editable: store them under a new `site_content.section_key = "payment_methods"` entry (same pattern as `store_products`), have `ManualPaymentDetails` fetch via `getSiteContent`, and wire `SettingsManager`'s existing inputs to write to it.
4. **No bulk "mark as verified" action** for admins processing many pending orders at once — `OrdersManager.tsx`'s table is single-select only today.
5. **The "Additional Links" from the client's nav spec** (New Arrivals, Best Sellers, Sale, Brands, Design Services) are not implemented — they were explicitly marked "not product categories" in the client's spec and were never requested as a build task.

---

## 8. Quick Reference — Every File That Matters

```
data/productCatalog.ts                         — 8 fixed categories + subcategories (code, not CMS)
data/storeProducts.ts                           — 71-item seed/fallback product list
types.d.ts                                       — StoreProduct, OrderRecord, ConsultationRecord, ProductCategory

components/collection/
  ProductCatalog.tsx                             — /collection page: category grid, Popular Products, Shop the Look
  CategoryDetailView.tsx                         — /collection/[category] page: hero, subcategory icon filter, product grid
  ProductCard.tsx                                — product tile, opens the QuickView modal (ProductModal.tsx) on click
  *SubcategoryIcons.tsx (x8)                     — per-category icon sets, see §3
  DirectCheckoutModal.tsx                        — single-package buy modal with payment step

components/payment/ManualPaymentDetails.tsx      — shared QR/bank-details panel (hardcoded, see §7.3)
components/ui/CartDrawer.tsx                     — cart sidebar, links to /checkout

app/checkout/page.tsx                            — full-page cart checkout
app/orders/[id]/page.tsx                         — order status + printable receipt
app/orders/track/page.tsx                        — order lookup form
app/api/checkout/order/route.ts                  — creates an order, sends confirmation email
app/api/checkout/consultation/route.ts           — creates a consultation booking
app/api/orders/[id]/route.ts                     — public order lookup by id
app/api/orders/lookup/route.ts                   — public order lookup by order_number + contact
app/api/upload/route.ts                          — generic file upload (products, screenshots, attachments)

lib/server/email/
  resend.ts, orderEmailService.ts, emailService.ts, templates/

components/admin/
  store/StoreProductsManager.tsx                 — product CRUD UI
  orders/OrdersManager.tsx, OrderDetailModal.tsx  — order management + payment verification
  consultations/ConsultationsManager.tsx, ../BookingDetailModal.tsx
  payments/PaymentsManager.tsx                   — unified read-only ledger
  settings/SettingsManager.tsx                   — manual payment methods reference card

app/api/admin/store-products/route.ts            — GET/POST products
app/api/admin/store-products/[id]/route.ts       — PATCH/PUT/DELETE a product
app/api/admin/orders/route.ts, [id]/route.ts     — admin order list/update
```
