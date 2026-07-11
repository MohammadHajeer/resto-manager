import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, Mail, Scale, CheckCircle, AlertTriangle, HelpCircle, RefreshCw } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      {/* Main Content Area */}
      <main className="flex-1 py-12 px-4 sm:px-6 md:px-8 max-w-4xl mx-auto w-full">
        {/* Title & Last Updated Header */}
        <div className="mb-10 text-center sm:text-left border-b border-border pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-4">
            <FileText size={12} /> Terms of Use
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight leading-none mb-3">
            Terms
          </h1>
          <p className="text-sm text-muted-foreground font-semibold flex items-center justify-center sm:justify-start gap-1.5">
            <RefreshCw size={13} className="animate-spin-slow text-primary" />
            Last Updated: July 10, 2026
          </p>
        </div>

        {/* Structured Legal Content */}
        <div className="space-y-10 text-left">
          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="w-7 h-7 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-black">1</span>
              Acceptance of the Terms
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              By accessing, browsing, or utilizing the RestoManager platform (including all client-side portals, API configurations, and owner-facing consoles), you explicitly acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not accept these conditions in full, you are strictly prohibited from utilizing the RestoManager suite.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="w-7 h-7 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-black">2</span>
              Account Registration & Security
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              To utilize core dashboard capabilities, restaurant owners must establish a verified merchant profile. You agree to:
            </p>
            <ul className="space-y-2 text-xs text-muted-foreground pl-5 list-disc">
              <li>Provide completely accurate, up-to-date, and honest personal and business listings during signup.</li>
              <li>Maintain the strict confidentiality of your dashboard password and device access tokens.</li>
              <li>Accept sole, complete accountability for any data edits, orders fulfilled, or actions executed under your profile login.</li>
              <li>Notify RestoManager immediately of any unauthorized breach of your business console credentials.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="w-7 h-7 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-black">3</span>
              Restaurant Owner Responsibilities
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Merchants operating on the RestoManager platform accept responsibility for their menu listings, price points, and operational details. Specifically, merchants must:
            </p>
            <div className="bg-white p-5 rounded-2xl border border-border/80 shadow-xs space-y-3">
              <div className="flex gap-2.5 items-start">
                <CheckCircle size={16} className="text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground"><strong>In-Menu Integrity:</strong> Provide accurate item descriptions, allergen warnings, realistic graphics, and pricing that aligns with physical storefront menu rates.</p>
              </div>
              <div className="flex gap-2.5 items-start">
                <CheckCircle size={16} className="text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground"><strong>Opening Hours Calibration:</strong> Keep opening schedules, reservation settings, and delivery slots actively calibrated to ensure customers do not place orders during off-hours.</p>
              </div>
              <div className="flex gap-2.5 items-start">
                <CheckCircle size={16} className="text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground"><strong>Quality Compliance:</strong> Prepare all food items in strict compliance with local sanitary codes, maintaining adequate temperature and safety criteria during transition states.</p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="w-7 h-7 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-black">4</span>
              Verification, Rejection, & Suspension
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We reserve the absolute right to screen new store applicants, verify operational credentials, and audit submitted licenses. RestoManager holds total unilateral discretion to reject, temporarily suspend, or permanently purge any restaurant store profile from our platform if:
            </p>
            <ul className="space-y-2 text-xs text-muted-foreground pl-5 list-disc">
              <li>The merchant fails to provide valid business identification papers during onboarding audits.</li>
              <li>A high frequency of customer complaints, food safety issues, or extreme cancellation rates is registered.</li>
              <li>Fraudulent charges or duplicate chargebacks are linked back to the storefront checkout.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="w-7 h-7 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-black">5</span>
              Fraud & Prohibited Behavior
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Users (both customers and restaurant staff) are strictly forbidden from executing malicious activities on the platform. Prohibited behaviors include:
            </p>
            <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl grid gap-3 sm:grid-cols-2 text-xs text-red-900/80">
              <div className="flex gap-2">
                <AlertTriangle size={15} className="text-destructive shrink-0 mt-0.5" />
                <span>Entering false or intentionally misleading orders to disrupt store inventory.</span>
              </div>
              <div className="flex gap-2">
                <AlertTriangle size={15} className="text-destructive shrink-0 mt-0.5" />
                <span>Scraping platform text databases, menu prices, or owner images without explicit written consent.</span>
              </div>
              <div className="flex gap-2">
                <AlertTriangle size={15} className="text-destructive shrink-0 mt-0.5" />
                <span>Injecting remote scripting commands or code payloads into dashboard input forms.</span>
              </div>
              <div className="flex gap-2">
                <AlertTriangle size={15} className="text-destructive shrink-0 mt-0.5" />
                <span>Establishing multiple copycat accounts to circumvent past suspensions or reviews restrictions.</span>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="w-7 h-7 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-black">6</span>
              Ownership of Uploaded Content
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              When a restaurant owner uploads images, logos, copy text, or recipe details to RestoManager, they retain full proprietary copyright ownership of those intellectual assets.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              However, by uploading these assets, you grant RestoManager a worldwide, non-exclusive, royalty-free, perpetual license to host, parse, cache, scale, display, and distribute those images on our public customer search directory to facilitate orders for your restaurant.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="w-7 h-7 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-black">7</span>
              Cancellation & Refund Limitations
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Once a restaurant accepts a customer’s online order, preparation immediately begins. Therefore, order cancellations and subsequent refunds are strictly regulated:
            </p>
            <ul className="space-y-2 text-xs text-muted-foreground pl-4 list-disc">
              <li><strong>Customer Cancellations:</strong> Orders cannot be canceled or modified once the kitchen changes the status to "In Progress".</li>
              <li><strong>Restaurant Cancellations:</strong> If a merchant runs out of ingredients or must cancel an accepted ticket, they must immediately process an automated credit refund to the customer.</li>
              <li><strong>Dispute Arbitration:</strong> Refund claims regarding portion size, visual deviations, or temperature must be resolved through direct merchant-customer interaction or escalated to RestoManager Support within 24 hours of delivery.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="w-7 h-7 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-black">8</span>
              Availability & Limitation of Liability
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              RestoManager is provided on an <strong>"as is"</strong> and <strong>"as available"</strong> framework. We do not guarantee uninterrupted server uptimes, instantaneous kitchen notifications, or total lack of operational delays.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              To the maximum extent permitted under statutory law, RestoManager, its directors, and developers shall <strong>never</strong> be held liable for any indirect, incidental, punitive, or consequential damages arising from database service down-states, lost commercial revenues, food safety incidents, or physical dispatch errors.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="w-7 h-7 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-black">9</span>
              Contact Information
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              For any legal escalations, compliance reviews, or requests regarding trademark safety and billing concerns, please get in touch with our legal administration:
            </p>
            <div className="bg-white p-5 rounded-2xl border border-border shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center text-primary shrink-0">
                <Scale className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground font-semibold">Legal Operations Team</p>
                <p className="text-sm font-bold text-foreground">legal@restomanager.example.com</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Corporate Office Address: 100 Innovation Way, Suite B, London, UK</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
