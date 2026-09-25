"use client";

import React from "react";
import { LegalPageLayout, LegalSectionItem } from "./LegalPageLayout";
import { ShieldCheck, CreditCard, Lock } from "lucide-react";

export const privacySections: LegalSectionItem[] = [
  { id: "introduction", title: "Introduction & Atelier Governance" },
  { id: "information-collected", title: "Information We Collect" },
  {
    id: "architectural-site-data",
    title: "Architectural & Cadastral Site Data",
  },
  { id: "processing-purposes", title: "How We Process Your Information" },
  { id: "payment-security", title: "Payment Processing & SBP Compliance" },
  { id: "virtual-consultations", title: "Google Meet & OAuth 2.0 Integration" },
  { id: "data-retention", title: "Cloud Storage & CAD Archival Policy" },
  { id: "third-party-disclosures", title: "Third-Party Service Providers" },
  {
    id: "overseas-clients",
    title: "Overseas Pakistani Clients & Data Transfers",
  },
  { id: "client-rights", title: "Your Data Rights & Blueprint Access" },
  { id: "cookies-storage", title: "Cookies & LocalStorage Telemetry" },
  { id: "data-security", title: "Information Security Protocols" },
  { id: "contact-dpo", title: "Atelier Legal Desk & Contact" },
];

export const PrivacyPolicyContent: React.FC = () => {
  return (
    <LegalPageLayout
      title="Privacy Policy & Data Protection"
      subtitle="How MARK Architects Atelier collects, processes, encrypts, and protects client personal information, architectural surveys, and payment data across Pakistan and international jurisdictions."
      documentType="Privacy Policy"
      effectiveDate="September 01, 2026"
      lastUpdated="September 24, 2026"
      version="2.4"
      sections={privacySections}
    >
      <div className="space-y-12 text-sm leading-relaxed text-stone-700 dark:text-zinc-300">
        {/* Section 1 */}
        <section id="introduction" className="scroll-mt-32 space-y-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-tertiary dark:text-amber-400">
              01
            </span>
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-stone-900 dark:text-white m-0">
              Introduction & Atelier Governance
            </h2>
          </div>
          <p>
            MARK Architects Pvt. Ltd. (&ldquo;MARK Architects&rdquo;,
            &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;the Atelier&rdquo;)
            is an architectural and engineering masterplanning practice
            headquartered in Peshawar with active project representations across
            Islamabad, Lahore, and Karachi. Led by PCATP-registered architects,
            we hold client confidentiality and data integrity as paramount
            tenets of professional practice.
          </p>
          <p>
            This Privacy Policy governs the collection, storage, processing, and
            protection of personal data, architectural project briefs, cadastral
            survey documents, and financial transaction identifiers gathered
            through our web platform (
            <span className="font-mono text-xs text-stone-900 dark:text-white">
              https://markarchitects.com
            </span>
            ), digital checkout systems, virtual consultation funnels, and
            atelier communications.
          </p>
          <div className="p-4 rounded-2xl bg-stone-100/80 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 flex items-start gap-3 text-xs not-prose">
            <ShieldCheck className="w-5 h-5 text-tertiary dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-stone-900 dark:text-white block">
                Statutory Regulatory Alignment
              </span>
              <span className="text-stone-600 dark:text-zinc-400 mt-0.5 block leading-normal">
                This document conforms with the Pakistan Council of Architects
                and Town Planners (PCATP) Code of Professional Conduct, the
                State Bank of Pakistan (SBP) E-Commerce Payment Framework, and
                prevailing digital privacy principles.
              </span>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section id="information-collected" className="scroll-mt-32 space-y-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-tertiary dark:text-amber-400">
              02
            </span>
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-stone-900 dark:text-white m-0">
              Information We Collect
            </h2>
          </div>
          <p>
            When engaging with the Atelier for consultation calls, turnkey
            design packages, or custom commissions, we collect specific
            categories of personal information:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Identity & Contact Coordinates:</strong> Full client legal
              name, primary email address, direct telephone and WhatsApp contact
              numbers, and postal delivery coordinates for physical blueprint
              roll handovers.
            </li>
            <li>
              <strong>Billing & Transaction Metadata:</strong> Invoice
              references, transaction order numbers (e.g.{" "}
              <code>ORD-XXXXXX-XXX</code>), payment verification statuses, and
              Safepay tracking tokens. We do <em>not</em> store full
              credit/debit card numbers or CVVs on our servers.
            </li>
            <li>
              <strong>Consultation Scheduling Coordinates:</strong> Reserved
              appointment dates, time slots, preferred timezones (PKT, GMT, EST,
              GST), and client attendee lists.
            </li>
            <li>
              <strong>Technical & Session Telemetry:</strong> Anonymized IP
              addresses, browser user-agent profiles, operating system
              specifications, and screen viewport dimensions utilized strictly
              for platform optimization and responsive canvas rendering.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section
          id="architectural-site-data"
          className="scroll-mt-32 space-y-4"
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-tertiary dark:text-amber-400">
              03
            </span>
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-stone-900 dark:text-white m-0">
              Architectural & Cadastral Site Data
            </h2>
          </div>
          <p>
            To produce mathematically rigorous architectural drawings,
            structural engineering schemes, and municipal approval dossiers,
            clients submit proprietary site information:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Plot Coordinates & Dimensions:</strong> Plot numbers,
              street designations, sector allocations, total square footage, and
              standard parcel sizes (e.g., 5 Marla, 10 Marla, 1 Kanal, or custom
              agricultural acreages).
            </li>
            <li>
              <strong>Cadastral Documents & Land Records:</strong> Aks-e-Shajra
              blueprints, fard-e-malkiat copies, possession letters, and
              official demarcation certificates.
            </li>
            <li>
              <strong>Geotechnical & Topographic Surveys:</strong> Soil
              investigation bore-hole reports, water table analyses, and site
              elevation contours uploaded via our secure file portal.
            </li>
            <li>
              <strong>Photographic & Contextual Media:</strong> Site context
              photographs, adjacent structure elevations, neighborhood setbacks,
              and client inspiration references.
            </li>
          </ul>
          <p className="text-xs text-stone-500 dark:text-zinc-400 italic">
            All submitted plot surveys and property deeds are treated as
            strictly confidential client work product and are stored in
            isolated, access-restricted cloud storage buckets.
          </p>
        </section>

        {/* Section 4 */}
        <section id="processing-purposes" className="scroll-mt-32 space-y-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-tertiary dark:text-amber-400">
              04
            </span>
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-stone-900 dark:text-white m-0">
              How We Process Your Information
            </h2>
          </div>
          <p>
            MARK Architects operates under a principle of strict purpose
            limitation. Your data is utilized solely for:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose">
            <div className="p-4 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <span className="font-bold text-xs text-stone-900 dark:text-white block mb-1">
                Drafting & Engineering
              </span>
              <p className="text-xs text-stone-600 dark:text-zinc-400 leading-normal">
                Generating architectural masterplans, 3D renderings, structural
                calculations, and MEP infrastructure sets conforming to plot
                dimensions.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <span className="font-bold text-xs text-stone-900 dark:text-white block mb-1">
                Municipal Authority Submission
              </span>
              <p className="text-xs text-stone-600 dark:text-zinc-400 leading-normal">
                Preparing submission drawings according to building bye-laws of
                PDA (Peshawar), CDA (Islamabad), RDA (Rawalpindi), LDA (Lahore),
                and DHA schemes.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <span className="font-bold text-xs text-stone-900 dark:text-white block mb-1">
                Consultation Orchestration
              </span>
              <p className="text-xs text-stone-600 dark:text-zinc-400 leading-normal">
                Scheduling video review appointments, sending Google Meet
                conferencing links, and providing project status briefings.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <span className="font-bold text-xs text-stone-900 dark:text-white block mb-1">
                Fiscal Invoicing & Receipts
              </span>
              <p className="text-xs text-stone-600 dark:text-zinc-400 leading-normal">
                Issuing digital tax receipts, verifying Safepay advance
                settlements, and accounting for outstanding milestone balances.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section id="payment-security" className="scroll-mt-32 space-y-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-tertiary dark:text-amber-400">
              05
            </span>
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-stone-900 dark:text-white m-0">
              Payment Processing & SBP Compliance
            </h2>
          </div>
          <p>
            To guarantee absolute financial privacy, all online payments on MARK
            Architects (including the 50% mobilization advance and consultation
            booking fees) are processed through <strong>Safepay</strong>, a
            digital payment service provider licensed and regulated by the State
            Bank of Pakistan (SBP).
          </p>
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-white">
              <CreditCard className="w-4 h-4 text-tertiary dark:text-amber-400" />
              <span>Zero Card Data Storage Principle</span>
            </div>
            <p className="text-stone-600 dark:text-zinc-400 leading-relaxed">
              When checking out, your browser communicates directly with
              Safepay&apos;s PCI-DSS compliant checkout engine over an encrypted
              TLS 1.3 channel with 256-bit AES encryption. MARK Architects never
              stores, views, or intercepts client card numbers, CVV codes, or
              bank PINs. Our database only records cryptographic transaction
              tokens (e.g.,{" "}
              <code>track_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx</code>) used
              solely for audit verification.
            </p>
          </div>
        </section>

        {/* Section 6 */}
        <section id="virtual-consultations" className="scroll-mt-32 space-y-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-tertiary dark:text-amber-400">
              06
            </span>
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-stone-900 dark:text-white m-0">
              Google Meet & OAuth 2.0 Integration
            </h2>
          </div>
          <p>
            Our strategic video consultation service integrates directly with
            the Google Calendar API and Google Meet via an authenticated Google
            Cloud OAuth 2.0 connector.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Authorized Scope:</strong> We request minimal permissions
              strictly necessary to insert the consultation appointment onto the
              studio&apos;s primary calendar and generate a dedicated,
              high-security Google Meet URL.
            </li>
            <li>
              <strong>Client Calendar Sync:</strong> When you provide your email
              during booking, Google sends you a calendar invitation. We do not
              access, inspect, or modify your personal Google account or
              calendar data.
            </li>
            <li>
              <strong>Call Confidentiality:</strong> Virtual design meetings
              between clients and principal architects are conducted privately.
              No automatic recording or screen capture takes place unless
              explicitly requested by the client for review purposes.
            </li>
          </ul>
        </section>

        {/* Section 7 */}
        <section id="data-retention" className="scroll-mt-32 space-y-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-tertiary dark:text-amber-400">
              07
            </span>
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-stone-900 dark:text-white m-0">
              Cloud Storage & CAD Archival Policy
            </h2>
          </div>
          <p>
            Client data is hosted in our enterprise Supabase PostgreSQL cluster,
            protected by strict Row Level Security (RLS) policies and automated
            daily backups:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Active Project Lifecycle:</strong> Personal contact
              records, site surveys, and consultation notes are retained
              actively throughout design conception, municipal permitting, and
              structural execution.
            </li>
            <li>
              <strong>Perpetual CAD Blueprints Archive:</strong> Finalized
              architectural vector PDFs, structural calculations, and electrical
              schematics are archived in secure cold storage for a period of 10
              years. This ensures homeowners can retrieve official copy sets in
              the event of future renovations, home extensions, or property
              resale.
            </li>
            <li>
              <strong>Draft Surveys Purge:</strong> Unused preliminary upload
              drafts from abandoned inquiries are automatically expunged after
              90 days of inactivity.
            </li>
          </ul>
        </section>

        {/* Section 8 */}
        <section
          id="third-party-disclosures"
          className="scroll-mt-32 space-y-4"
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-tertiary dark:text-amber-400">
              08
            </span>
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-stone-900 dark:text-white m-0">
              Third-Party Service Providers
            </h2>
          </div>
          <p>
            We partner with a limited roster of industry-standard technology
            vendors to deliver our digital atelier experience:
          </p>
          <div className="overflow-x-auto not-prose">
            <table className="w-full text-xs text-left border-collapse border border-stone-200 dark:border-zinc-800">
              <thead className="bg-stone-50 dark:bg-zinc-900 text-stone-700 dark:text-zinc-300 font-mono uppercase">
                <tr>
                  <th className="p-3 border border-stone-200 dark:border-zinc-800">
                    Provider
                  </th>
                  <th className="p-3 border border-stone-200 dark:border-zinc-800">
                    Purpose
                  </th>
                  <th className="p-3 border border-stone-200 dark:border-zinc-800">
                    Jurisdiction
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-zinc-800 font-inter">
                <tr>
                  <td className="p-3 font-semibold text-stone-900 dark:text-white">
                    Safepay
                  </td>
                  <td className="p-3 text-stone-600 dark:text-zinc-400">
                    Credit/Debit card processing & SBP payment settlement
                  </td>
                  <td className="p-3 font-mono">Pakistan</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-stone-900 dark:text-white">
                    Supabase
                  </td>
                  <td className="p-3 text-stone-600 dark:text-zinc-400">
                    PostgreSQL database, authentication & survey media storage
                  </td>
                  <td className="p-3 font-mono">United States / Global</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-stone-900 dark:text-white">
                    Google Cloud
                  </td>
                  <td className="p-3 text-stone-600 dark:text-zinc-400">
                    Google Meet video conferencing & Google Calendar dispatch
                  </td>
                  <td className="p-3 font-mono">United States / Global</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-stone-900 dark:text-white">
                    Resend
                  </td>
                  <td className="p-3 text-stone-600 dark:text-zinc-400">
                    Transactional email notifications, receipts & meeting links
                  </td>
                  <td className="p-3 font-mono">United States</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-stone-500 dark:text-zinc-400">
            MARK Architects does <strong>not</strong> sell, lease, or monetize
            client personal data, phone numbers, or property blueprints to real
            estate marketers, advertisers, or third parties under any
            circumstances.
          </p>
        </section>

        {/* Section 9 */}
        <section id="overseas-clients" className="scroll-mt-32 space-y-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-tertiary dark:text-amber-400">
              09
            </span>
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-stone-900 dark:text-white m-0">
              Overseas Pakistani Clients & Data Transfers
            </h2>
          </div>
          <p>
            A substantial portion of our commissions originate from Non-Resident
            Pakistanis (NRPs) residing in the United Kingdom, United States,
            Canada, Europe, and the GCC. When overseas clients access our
            platform, their project data is transmitted to our secure cloud
            infrastructure. We apply the same rigorous European GDPR-aligned
            security safeguards to all international briefs.
          </p>
        </section>

        {/* Section 10 */}
        <section id="client-rights" className="scroll-mt-32 space-y-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-tertiary dark:text-amber-400">
              10
            </span>
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-stone-900 dark:text-white m-0">
              Your Data Rights & Blueprint Access
            </h2>
          </div>
          <p>
            Clients maintain comprehensive rights concerning their stored
            information:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Right to Access & Copy:</strong> You may request an export
              of all personal records and digital deliverables associated with
              your consultation or order number.
            </li>
            <li>
              <strong>Right to Rectification:</strong> You may update your
              contact email, phone number, or plot specifications by notifying
              our administration desk.
            </li>
            <li>
              <strong>Right to Deletion:</strong> Upon project completion and
              final account settlement, you may request the deletion of
              non-statutory personal identifiers. Statutory accounting records
              and municipal certification copies must be maintained in
              accordance with Pakistani corporate law.
            </li>
          </ul>
        </section>

        {/* Section 11 */}
        <section id="cookies-storage" className="scroll-mt-32 space-y-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-tertiary dark:text-amber-400">
              11
            </span>
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-stone-900 dark:text-white m-0">
              Cookies & LocalStorage Telemetry
            </h2>
          </div>
          <p>
            Our web application utilizes minimal, privacy-first browser storage:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>
                Local Storage (<code>mark_architects_store_v1</code>):
              </strong>{" "}
              Retains your active Cart items and confirmed order receipts so
              that your design package selection remains intact when browsing
              between pages. This data resides purely on your device and can be
              cleared instantly via the &ldquo;Clear History&rdquo; button in
              the Cart Drawer.
            </li>
            <li>
              <strong>Session Cookies:</strong> Strictly functional cookies
              utilized for secure administrator authentication and CSRF token
              verification.
            </li>
          </ul>
        </section>

        {/* Section 12 */}
        <section id="data-security" className="scroll-mt-32 space-y-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-tertiary dark:text-amber-400">
              12
            </span>
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-stone-900 dark:text-white m-0">
              Information Security Protocols
            </h2>
          </div>
          <p>
            MARK Architects deploys defense-in-depth security measures to
            protect the atelier from unauthorized access, modification, or
            exposure:
          </p>
          <div className="p-4 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-900/60 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-semibold text-stone-900 dark:text-white">
              <Lock className="w-3.5 h-3.5 text-tertiary dark:text-amber-400" />
              <span>Technical & Administrative Safeguards</span>
            </div>
            <p className="text-stone-600 dark:text-zinc-400 leading-normal">
              1. End-to-end HTTPS/TLS 1.3 enforcement with strict HSTS headers
              across all domains.
              <br />
              2. Single-email administrative access lockdown preventing
              brute-force portal breach.
              <br />
              3. Database-level Row Level Security (RLS) restricting query
              access to authorized authorities.
              <br />
              4. Regular security audits and cryptographic HMAC signature
              validation on all incoming payment gateway webhooks.
            </p>
          </div>
        </section>

        {/* Section 13 */}
        <section id="contact-dpo" className="scroll-mt-32 space-y-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-tertiary dark:text-amber-400">
              13
            </span>
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-stone-900 dark:text-white m-0">
              Atelier Legal Desk & Contact
            </h2>
          </div>
          <p>
            For privacy inquiries, data subject access requests, or official
            regulatory correspondence, please communicate directly with our
            Legal & Data Governance team:
          </p>
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 space-y-3 not-prose text-xs">
            <div className="font-bold text-stone-900 dark:text-white text-sm">
              MARK Architects Pvt. Ltd. — Legal & Compliance Bureau
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
                  Head Studio:
                </strong>{" "}
                4A, Al-Haj Sher Tower, Ring Road, Near Hayatabad, Peshawar,
                Khyber Pakhtunkhwa, Pakistan
              </div>
              <div>
                <strong className="text-stone-800 dark:text-zinc-200">
                  Liaison Office:
                </strong>{" "}
                Executive Heights, Sector F-7, Blue Area, Islamabad, Pakistan
              </div>
              <div>
                <strong className="text-stone-800 dark:text-zinc-200">
                  Direct Telephone:
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
