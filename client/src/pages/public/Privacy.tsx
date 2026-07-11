import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Mail, FileText, Lock, Globe, Eye, RefreshCw } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      {/* Top Banner Warning for project purpose */}
      <div className="bg-secondary border-b border-secondary-foreground/10 px-4 py-2 text-center text-xs font-semibold text-secondary-foreground">
        ⚠️ Notice: This document is a draft prepared for project demonstration purposes and requires professional legal review prior to production deployment.
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-border py-4 px-4 sm:px-8 flex justify-between items-center">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-sm shadow-primary/20 transition-transform group-hover:scale-105">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-foreground tracking-tight block">RestoManager</span>
              <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block -mt-1">Policy Center</span>
            </div>
          </Link>
          <Link
            to="/restaurants"
            className="flex items-center gap-1.5 text-xs font-bold text-foreground hover:text-primary bg-secondary/40 hover:bg-secondary px-4 py-2.5 rounded-xl transition-all"
          >
            <ArrowLeft size={14} />
            <span>Back to Restaurants</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 py-12 px-4 sm:px-6 md:px-8 max-w-4xl mx-auto w-full">
        {/* Title & Last Updated Header */}
        <div className="mb-10 text-center sm:text-left border-b border-border pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-4">
            <Lock size={12} /> Privacy and Protection
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight leading-none mb-3">
            Privacy
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
              Personal Information We Collect
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              At RestoManager, we collect specific information to provide seamless online ordering, restaurant listing, and back-office management solutions. The types of personal data we acquire depend on your user type:
            </p>
            <div className="grid gap-4 sm:grid-cols-2 mt-4">
              <div className="bg-white p-5 rounded-2xl border border-border/80 shadow-xs">
                <h3 className="text-sm font-bold text-primary mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary inline-block" /> For Customers
                </h3>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span><strong>Contact Information:</strong> Full name, email address, and verified mobile number.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span><strong>Delivery Details:</strong> Physical address coordinates and delivery instructions.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span><strong>Order & Cart Activity:</strong> Selection logs, transaction history, and custom checkout preferences.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-border/80 shadow-xs">
                <h3 className="text-sm font-bold text-primary mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary inline-block" /> For Restaurant Owners
                </h3>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span><strong>Business Verification:</strong> Legal entity status, corporate identification numbers, and operating licenses.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span><strong>Listing Media:</strong> Restaurant banners, menus, logos, and high-resolution food images.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span><strong>Profile Metadata:</strong> Precise street addresses, contact details, customized categories, and operational hours.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="w-7 h-7 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-black">2</span>
              Purpose and Usage of Collected Data
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We process personal information under strict legal bases. The primary purposes of this processing are:
            </p>
            <ul className="grid gap-3 sm:grid-cols-2 text-xs text-muted-foreground pl-1">
              <li className="p-3 bg-muted/50 rounded-xl border border-border/50">
                <strong>Service Fulfillment:</strong> Relaying customer orders to restaurant kitchen boards and dispatching riders to delivery destinations.
              </li>
              <li className="p-3 bg-muted/50 rounded-xl border border-border/50">
                <strong>Platform Optimization:</strong> Analyzing platform speeds, user engagement rates, and category preferences to fine-tune our algorithms.
              </li>
              <li className="p-3 bg-muted/50 rounded-xl border border-border/50">
                <strong>Identity Verification:</strong> Reviewing uploaded business licenses to ensure only legitimate merchants operate on the platform.
              </li>
              <li className="p-3 bg-muted/50 rounded-xl border border-border/50">
                <strong>Support Resolution:</strong> Addressing complaints, refund operations, and application troubleshooting via our Support Desk.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="w-7 h-7 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-black">3</span>
              Media & Document Storage
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Documents and image assets uploaded to RestoManager (including menu photos, restaurant logo files, and merchant verification papers) are stored in secure cloud objects with access-control matrices.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Images are processed and served over globally distributed CDNs (Content Delivery Networks) to provide rapid page loading. Private documents (such as corporate licenses or bank statements uploaded during merchant verification) are strongly partitioned and are <strong>never</strong> exposed publicly or shared with third parties.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="w-7 h-7 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-black">4</span>
              Who Can Access the Data
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We enforce strict authorization parameters to limit data visibility:
            </p>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">✔</span>
                <span><strong>The Linked Restaurant:</strong> The specific merchant fulfilling your order receives your name, phone number, and physical coordinates for delivery.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">✔</span>
                <span><strong>Core Operations Staff:</strong> A limited number of RestoManager system administrators may view partner profiles during verification workflows.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">✔</span>
                <span><strong>Legal Compliance:</strong> We may share data under court order or regulatory requirements where mandated by law.</span>
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="w-7 h-7 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-black">5</span>
              Cookies and Authentication Sessions
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Our platform implements local tracking technologies to maintain reliable session statuses:
            </p>
            <ul className="space-y-2 text-xs text-muted-foreground pl-4 list-disc">
              <li><strong>Authentication Tokens:</strong> Secure local storage variables keep you logged into the Owners Dashboard or Customer Account panel without requiring re-authentication on every page refresh.</li>
              <li><strong>Cart Preservation:</strong> Client-side session structures store pending culinary selections so they remain safe inside your tray should you temporarily leave the screen.</li>
              <li><strong>Performance Cache:</strong> Anonymized metrics track response speeds so we can proactively load assets relevant to your geographic vicinity.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="w-7 h-7 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-black">6</span>
              Managing Your Data (Update or Delete)
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You retain absolute authority over your personal information. Users may:
            </p>
            <div className="p-4 bg-accent rounded-2xl border border-primary/10 text-xs text-accent-foreground flex flex-col gap-2">
              <p><strong>1. Instant profile edits:</strong> Correct restaurant listings, hours, and menu names directly inside the Owner Dashboard Settings drawer.</p>
              <p><strong>2. Account deletion request:</strong> Request standard purging of database profiles by submitting a ticket to our Support page or emailing the support desk.</p>
              <p>We process all data removal requests within 14 business days, preserving only transactional details legally required for bookkeeping audits.</p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="w-7 h-7 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-black">7</span>
              Information Security Measures
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We employ military-grade TLS/SSL certificates for data-in-transit encryption, combined with rigorous Firestore firewall conditions for static data protection. While we implement every reasonable protection standard, no system can guarantee 100% absolute defense; we encourage all owners to employ complex dashboard passwords and protect their device access credentials.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="w-7 h-7 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-black">8</span>
              Contact Information
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              For any questions regarding this Privacy Policy or our operational security guidelines, please get in touch with our security compliance team:
            </p>
            <div className="bg-white p-5 rounded-2xl border border-border shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center text-primary shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground font-semibold">Security Compliance Desk</p>
                <p className="text-sm font-bold text-foreground">privacy@restomanager.example.com</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Response timeframe: Under 48 hours</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="bg-white border-t border-border py-8 text-center text-xs text-muted-foreground mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} RestoManager. All rights reserved.</p>
          <div className="flex gap-4 font-bold text-foreground">
            <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link to="/support" className="hover:text-primary transition-colors">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
