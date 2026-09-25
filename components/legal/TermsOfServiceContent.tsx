"use client";

import React from "react";
import { LegalPageLayout, LegalSectionItem } from "./LegalPageLayout";
import { Award, AlertTriangle } from "lucide-react";

export const termsSections: LegalSectionItem[] = [
  { id: "acceptance", title: "Acceptance & Atelier Engagement" },
  { id: "statutory-standards", title: "PCATP & PEC Statutory Licensing" },
  { id: "service-scope", title: "Scope of Architectural Services" },
  {
    id: "formula-pricing",
    title: "Standardized Formula Pricing (PKR 57/sq.ft)",
  },
  {
    id: "mobilization-safepay",
    title: "Mobilization Advance & Safepay Billing",
  },
  {
    id: "video-consultations",
    title: "Video Consultations & Attendance Policy",
  },
  { id: "client-site-data", title: "Client Responsibilities & Plot Accuracy" },
  {
    id: "municipal-approvals",
    title: "Municipal Approvals & Authority Limits",
  },
  { id: "intellectual-property", title: "Copyright & Single-Site License" },
  { id: "revisions-scope", title: "Design Revisions & Scope Expansion" },
  { id: "cancellations-refunds", title: "Cancellation & Refund Finality" },
  { id: "liability-contractor", title: "Limitation of Liability & Site Work" },
  { id: "governing-law", title: "Governing Law & Arbitration (Pakistan)" },
  { id: "contact-legal", title: "Official Notices & Atelier Bureau" },
];

export const TermsOfServiceContent: React.FC = () => {
  return (
    <LegalPageLayout
      title="Terms of Service & Engagement"
      subtitle="Standardized contractual terms governing architectural design commissions, turnkey drawing packages, video consultations, and Safepay payments with MARK Architects."
      documentType="Terms of Service"
      effectiveDate="September 01, 2026"
      lastUpdated="September 24, 2026"
      version="3.1"
      sections={termsSections}
    >
      <div className="space-y-12 text-sm leading-relaxed text-stone-700 dark:text-zinc-300">
        {/* Section 1 */}
        <section id="acceptance" className="scroll-mt-32 space-y-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-tertiary dark:text-amber-400">
              01
            </span>
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-stone-900 dark:text-white m-0">
              Acceptance & Atelier Engagement
            </h2>
          </div>
          <p>
            Welcome to MARK Architects Pvt. Ltd. (&ldquo;MARK Architects&rdquo;,
            &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;the Atelier&rdquo;).
            By accessing our digital atelier portal (
            <span className="font-mono text-xs text-stone-900 dark:text-white">
              https://markarchitects.com
            </span>
            ), booking a strategic video consultation, reserving ready-to-build
            collection packages, or commissioning custom architectural
            blueprints, you (&ldquo;the Client&rdquo;) agree to be legally bound
            by these Terms of Service.
          </p>
          <p>
            If you are commissioning design works on behalf of a corporate body,
            real estate developer, or family trust, you warrant that you possess
            full legal authority to bind such entity to these conditions. If you
            do not agree with any provision herein, you must refrain from
            initiating payments or uploading site survey records.
          </p>
        </section>

        {/* Section 2 */}
        <section id="statutory-standards" className="scroll-mt-32 space-y-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-tertiary dark:text-amber-400">
              02
            </span>
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-stone-900 dark:text-white m-0">
              PCATP & PEC Statutory Licensing
            </h2>
          </div>
          <p>
            All architectural design schemes, layout corrections, and space
            planning are developed under the supervision of licensed architects
            registered in good standing with the{" "}
            <strong>
              Pakistan Council of Architects and Town Planners (PCATP)
            </strong>
            . All structural engineering calculations, seismic rebar details,
            and foundation depths are certified by professional engineers
            registered with the{" "}
            <strong>Pakistan Engineering Council (PEC)</strong>.
          </p>
          <div className="p-4 rounded-2xl bg-stone-100/80 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 flex items-start gap-3 text-xs not-prose">
            <Award className="w-5 h-5 text-tertiary dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-stone-900 dark:text-white block">
                Professional Ethics & Building Code Conformance
              </span>
              <span className="text-stone-600 dark:text-zinc-400 mt-0.5 block leading-normal">
                Our design solutions incorporate the Building Code of Pakistan
                (BCP - Seismic Provisions), NFPA fire egress principles, and
                municipal zoning bye-laws applicable to each respective
                metropolitan area.
              </span>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section id="service-scope" className="scroll-mt-32 space-y-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-tertiary dark:text-amber-400">
              03
            </span>
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-stone-900 dark:text-white m-0">
              Scope of Architectural Services
            </h2>
          </div>
          <p>
            MARK Architects delivers comprehensive design products and advisory
            services tailored across distinct operational tiers:
          </p>
          <div className="space-y-3 not-prose">
            <div className="p-4 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs">
              <span className="font-bold text-stone-900 dark:text-white text-sm block mb-1">
                Tier A: Strategic Video Consultations
              </span>
              <p className="text-stone-600 dark:text-zinc-400 leading-normal">
                1-on-1 virtual design reviews conducted via Google Meet
                (30-minute Basic Review or 60-minute Comprehensive Session).
                Covers floor plan critiques, spatial flow optimization, site
                feasibility, and preliminary zoning assessments.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs">
              <span className="font-bold text-stone-900 dark:text-white text-sm block mb-1">
                Tier B: Turnkey Working Drawing Packages
              </span>
              <p className="text-stone-600 dark:text-zinc-400 leading-normal">
                Complete design sets encompassing architectural floor plans,
                exterior elevations, building sections, door/window schedules,
                structural foundation & beam rebar layouts, electrical wiring &
                lighting schemes, plumbing/drainage schematics, and exterior 3D
                photorealistic visualizations.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs">
              <span className="font-bold text-stone-900 dark:text-white text-sm block mb-1">
                Tier C: Ready-to-Build Collection Packages
              </span>
              <p className="text-stone-600 dark:text-zinc-400 leading-normal">
                Pre-engineered, standardized luxury house blueprints customized
                to specific standard Pakistani plot dimensions (e.g. 5 Marla, 10
                Marla, 1 Kanal) delivered in ready-to-file vector formats.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section id="formula-pricing" className="scroll-mt-32 space-y-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-tertiary dark:text-amber-400">
              04
            </span>
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-stone-900 dark:text-white m-0">
              Standardized Formula Pricing (PKR 57/sq.ft)
            </h2>
          </div>
          <p>
            In alignment with our pledge to eliminate arbitrary price gouging in
            Pakistan&apos;s architectural market:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Standard Formula Rate:</strong> Comprehensive full-house
              architectural and engineering design sets are billed at the
              standardized studio baseline of{" "}
              <strong>PKR 57 per square foot of total covered area</strong>.
            </li>
            <li>
              <strong>Fixed Pricing Transparency:</strong> All calculations made
              on our online pricing estimator are binding for the scope
              specified. No hidden drafting fees, printing surcharges, or
              surprise markups will be added without prior written client
              approval.
            </li>
            <li>
              <strong>Covered Area Verification:</strong> If site survey
              revisions or municipal regulations increase the planned covered
              area by more than 5% during concept development, the total fee is
              adjusted proportionally based on the validated covered square
              footage.
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section id="mobilization-safepay" className="scroll-mt-32 space-y-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-tertiary dark:text-amber-400">
              05
            </span>
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-stone-900 dark:text-white m-0">
              Mobilization Advance & Safepay Billing
            </h2>
          </div>
          <p>
            Due to the intensive intellectual capital, engineering hours, and
            licensed CAD allocations required for custom structural blueprints:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose text-xs">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-stone-900 dark:text-zinc-200">
              <span className="font-bold text-sm block mb-1 text-tertiary dark:text-amber-400">
                1. 50% Mobilization Advance
              </span>
              <p className="text-stone-600 dark:text-zinc-400 leading-normal">
                To commence drafting and schedule structural consultations, the
                Client deposits a 50% advance fee processed securely via our
                Safepay gateway. Work begins immediately upon advance
                confirmation.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-stone-100 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-zinc-200">
              <span className="font-bold text-sm block mb-1 text-stone-900 dark:text-white">
                2. 50% Milestone Settlement
              </span>
              <p className="text-stone-600 dark:text-zinc-400 leading-normal">
                The remaining 50% balance is invoiced upon final floor plan
                sign-off and is payable prior to the release of high-resolution
                municipal submission sets, editable CAD files, and stamped
                structural sheets.
              </p>
            </div>
          </div>
          <p className="text-xs text-stone-500 dark:text-zinc-400">
            All gateway fees are handled transparently. Payment confirmations
            and official digital tax invoices are issued automatically to the
            client&apos;s email upon settlement.
          </p>
        </section>

        {/* Section 6 */}
        <section id="video-consultations" className="scroll-mt-32 space-y-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-tertiary dark:text-amber-400">
              06
            </span>
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-stone-900 dark:text-white m-0">
              Video Consultations & Attendance Policy
            </h2>
          </div>
          <p>
            Strategic video consultation appointments are subject to the
            following operating guidelines:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Rescheduling Window:</strong> Clients may reschedule an
              appointment without penalty by providing at least{" "}
              <strong>24 hours written notice</strong> prior to the confirmed
              time slot.
            </li>
            <li>
              <strong>Punctuality & Grace Period:</strong> The assigned
              principal architect will remain in the Google Meet session for 15
              minutes past the scheduled start time. If the client does not
              connect within 15 minutes, the session is marked as a
              &ldquo;Client No-Show&rdquo; and the consultation fee is
              forfeited.
            </li>
            <li>
              <strong>Technical Readiness:</strong> Clients are responsible for
              maintaining a stable internet connection and possessing any
              relevant site sketches or municipal deeds ready for screen
              sharing.
            </li>
          </ul>
        </section>

        {/* Section 7 */}
        <section id="client-site-data" className="scroll-mt-32 space-y-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-tertiary dark:text-amber-400">
              07
            </span>
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-stone-900 dark:text-white m-0">
              Client Responsibilities & Plot Accuracy
            </h2>
          </div>
          <p>
            The Client warrants that all property boundaries, survey dimensions,
            land ownership records, Aks-e-Shajra blueprints, and easement
            disclosures provided to the Atelier are truthful, accurate, and
            up-to-date.
          </p>
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 text-xs text-rose-900 dark:text-rose-200 space-y-1">
            <div className="flex items-center gap-2 font-bold">
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>Boundary Discrepancy Disclaimer</span>
            </div>
            <p className="leading-relaxed">
              MARK Architects bears zero liability for municipal fines, boundary
              disputes, or site demolition resulting from inaccurate
              client-supplied plot dimensions or undisclosed underground
              municipal utility lines. A certified physical land survey is
              strongly advised prior to foundation excavation.
            </p>
          </div>
        </section>

        {/* Section 8 */}
        <section id="municipal-approvals" className="scroll-mt-32 space-y-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-tertiary dark:text-amber-400">
              08
            </span>
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-stone-900 dark:text-white m-0">
              Municipal Approvals & Authority Limits
            </h2>
          </div>
          <p>
            MARK Architects prepares all blueprints in strict adherence to
            published zoning bye-laws of respective regulatory authorities,
            including:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs font-mono">
            <li>PDA (Peshawar Development Authority)</li>
            <li>CDA (Capital Development Authority, Islamabad)</li>
            <li>RDA (Rawalpindi Development Authority)</li>
            <li>LDA (Lahore Development Authority)</li>
            <li>
              DHA Schemes (Islamabad, Lahore, Peshawar, Karachi, Multan,
              Gujranwala)
            </li>
            <li>Bahria Town Masterplanning Bye-laws</li>
          </ul>
          <p>
            <strong>Regulatory Demarcation:</strong> The Atelier&apos;s
            contractual scope encompasses the creation of compliant, stampable
            drawings and technical advisory. Formal permit issuance, municipal
            scrutiny fees, challan deposits, and physical building NOC approvals
            are the legal responsibility of the property owner or their
            appointed on-ground liaison agent.
          </p>
        </section>

        {/* Section 9 */}
        <section id="intellectual-property" className="scroll-mt-32 space-y-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-tertiary dark:text-amber-400">
              09
            </span>
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-stone-900 dark:text-white m-0">
              Copyright & Single-Site License
            </h2>
          </div>
          <p>
            In accordance with international architectural copyright conventions
            and the Copyright Ordinance 1962 of Pakistan:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Atelier Ownership:</strong> All conceptual floor plans, 3D
              renderings, structural models, design motifs, and CAD files remain
              the exclusive intellectual property of MARK Architects Pvt. Ltd.
            </li>
            <li>
              <strong>Single-Site Construction License:</strong> Upon settlement
              of all invoice milestones, the Client is granted a perpetual,
              non-exclusive, non-transferable license to execute the
              architectural blueprints for the construction of{" "}
              <strong>
                one (1) single residential or commercial structure
              </strong>{" "}
              on the designated plot.
            </li>
            <li>
              <strong>Prohibition of Replication:</strong> The Client is
              strictly prohibited from reselling, licensing, publishing, or
              duplicating the architectural blueprints for speculative housing
              schemes, multi-plot housing colonies, or third-party construction
              without executing an explicit Developer Licensing Agreement with
              the Atelier.
            </li>
            <li>
              <strong>Portfolio Publication Right:</strong> MARK Architects
              reserves the perpetual right to photograph, render, and publish
              exterior and interior project photographs in monographs, digital
              portfolios, press releases, and design competitions.
            </li>
          </ul>
        </section>

        {/* Section 10 */}
        <section id="revisions-scope" className="scroll-mt-32 space-y-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-tertiary dark:text-amber-400">
              10
            </span>
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-stone-900 dark:text-white m-0">
              Design Revisions & Scope Expansion
            </h2>
          </div>
          <p>To guarantee project momentum and clear milestones:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Included Revisions:</strong> Standard turnkey design
              packages include up to{" "}
              <strong>three (3) iterative revision rounds</strong> during the
              preliminary floor plan concept phase (spatial reorientation,
              door/window movements, closet resizing).
            </li>
            <li>
              <strong>Structural Sign-Off Gate:</strong> Once the Client signs
              off on the conceptual floor plan and structural engineering
              begins, fundamental alterations (e.g. relocating load-bearing
              columns, adding extra floors, or completely changing the facade
              style) constitute a Scope Expansion and will be billed at standard
              studio hourly rates.
            </li>
          </ul>
        </section>

        {/* Section 11 */}
        <section id="cancellations-refunds" className="scroll-mt-32 space-y-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-tertiary dark:text-amber-400">
              11
            </span>
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-stone-900 dark:text-white m-0">
              Cancellation & Refund Finality
            </h2>
          </div>
          <p>
            Due to the non-tangible, bespoke nature of custom architectural
            engineering:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Digital Deliverables & Blueprints:</strong> Once design
              drafting has commenced following 50% mobilization deposit, the
              advance fee is non-refundable. Downloadable collection packages
              and completed CAD files are irrevocable digital goods.
            </li>
            <li>
              <strong>Consultations Refund Policy:</strong> If a Client cancels
              a video consultation with at least 24 hours prior notice, a full
              refund (less standard Safepay gateway processing fees of ~2.5%)
              will be credited to the original payment source.
            </li>
          </ul>
        </section>

        {/* Section 12 */}
        <section id="liability-contractor" className="scroll-mt-32 space-y-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-tertiary dark:text-amber-400">
              12
            </span>
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-stone-900 dark:text-white m-0">
              Limitation of Liability & Site Work
            </h2>
          </div>
          <p>
            MARK Architects provides architectural design, structural
            engineering calculations, and specification sheets. Unless an
            explicit, separate Site Supervision Contract has been executed:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              The Atelier does not act as general contractor, builder, or labor
              supervisor. We bear no liability for contractor negligence,
              substandard cement mixing, improper curing, or material
              substitutions on-site.
            </li>
            <li>
              Our maximum aggregate liability for any claim arising out of our
              professional services shall not exceed the total fees paid by the
              Client to MARK Architects under the specific disputed contract.
            </li>
          </ul>
        </section>

        {/* Section 13 */}
        <section id="governing-law" className="scroll-mt-32 space-y-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-tertiary dark:text-amber-400">
              13
            </span>
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-stone-900 dark:text-white m-0">
              Governing Law & Arbitration (Pakistan)
            </h2>
          </div>
          <p>
            These Terms of Service are governed by and construed in accordance
            with the statutory laws of the{" "}
            <strong>Islamic Republic of Pakistan</strong>.
          </p>
          <p>
            Any dispute, claim, or controversy arising out of this agreement
            that cannot be amicably resolved through mutual negotiation shall be
            referred to binding arbitration under the provisions of the{" "}
            <strong>Arbitration Act 1940 (Pakistan)</strong>. The seat of
            arbitration shall be Peshawar or Islamabad, conducted in the English
            language by a sole arbitrator jointly appointed by the parties.
          </p>
        </section>

        {/* Section 14 */}
        <section id="contact-legal" className="scroll-mt-32 space-y-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-tertiary dark:text-amber-400">
              14
            </span>
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-stone-900 dark:text-white m-0">
              Official Notices & Atelier Bureau
            </h2>
          </div>
          <p>
            All formal contract inquiries, power-of-attorney documents, or legal
            notices must be directed in writing to our Central Atelier
            Secretariat:
          </p>
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 space-y-3 not-prose text-xs">
            <div className="font-bold text-stone-900 dark:text-white text-sm">
              MARK Architects Pvt. Ltd. — Legal & Contracts Directorate
            </div>
            <div className="space-y-1.5 text-stone-600 dark:text-zinc-400">
              <div>
                <strong className="text-stone-800 dark:text-zinc-200">
                  Email:
                </strong>{" "}
                <a
                  href="mailto:briefs@markarchitects.com"
                  className="text-tertiary dark:text-amber-400 hover:underline"
                >
                  briefs@markarchitects.com
                </a>
              </div>
              <div>
                <strong className="text-stone-800 dark:text-zinc-200">
                  Official Head Office:
                </strong>{" "}
                Suite 4A, Al-Haj Sher Tower, Ring Road, Near Hayatabad,
                Peshawar, Pakistan
              </div>
              <div>
                <strong className="text-stone-800 dark:text-zinc-200">
                  Islamabad Atelier:
                </strong>{" "}
                Sector F-7, Blue Area, Islamabad, Pakistan
              </div>
              <div>
                <strong className="text-stone-800 dark:text-zinc-200">
                  Hotline:
                </strong>{" "}
                +92 (300) 123-4567
              </div>
            </div>
          </div>
        </section>
      </div>
    </LegalPageLayout>
  );
};
