import { useState } from "react";
import {
  Search,
  ShoppingCart,
  User as UserIcon,
  ArrowRight,
  Sparkles,
  CheckCircle,
  ChevronRight,
  Plus,
  TrendingUp,
  Menu as MenuIcon,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="w-full min-h-screen bg-background text-on-background selection:bg-primary selection:text-white flex flex-col font-sans">
      {/* TopNavBar */}
      <header className="sticky top-0 z-50 flex justify-between items-center w-full px-4 md:px-12 h-16 bg-white/80 backdrop-blur-md border-b border-gray-200/60 transition-all duration-300">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-xl font-bold text-primary tracking-tight"
            style={{ color: "#008a66" }}
          >
            RestoManager
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#home"
              className="text-primary font-bold border-b-2 border-primary text-xs tracking-wide py-1 hover:opacity-80 transition-opacity"
              style={{ color: "#008a66", borderColor: "#008a66" }}
            >
              Home
            </a>
            <a
              href="#features"
              className="text-gray-600 font-medium text-xs tracking-wide py-1 hover:text-primary transition-colors"
            >
              Features
            </a>
            <a
              href="#about"
              className="text-gray-600 font-medium text-xs tracking-wide py-1 hover:text-primary transition-colors"
            >
              About
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-gray-100 px-3.5 py-1.5 rounded-full border border-gray-200">
            <Search size={16} className="text-gray-400" />
            <input
              className="bg-transparent border-none focus:outline-none text-xs w-32 ml-1 text-slate-800 placeholder-slate-400"
              placeholder="Search..."
              type="text"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              className="text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingCart size={18} />
              <span
                className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"
                style={{ backgroundColor: "#008a66" }}
              ></span>
            </button>
            <Link
              to="/login"
              className="text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Profile"
            >
              <UserIcon size={18} />
            </Link>
            <Link
              to="/login"
              className="hidden lg:block text-gray-600 font-bold text-xs px-4 py-2 hover:text-primary transition-all"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-primary text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-emerald-800 active:scale-95 transition-all shadow-sm"
              style={{ backgroundColor: "#008a66" }}
            >
              Get Started
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Toggle Menu"
            >
              <MenuIcon size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 p-4 space-y-3 transition-all duration-300">
          <a
            href="#home"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-semibold text-primary px-3 py-2 bg-emerald-50 rounded-lg"
            style={{ color: "#008a66" }}
          >
            Home
          </a>
          <a
            href="#features"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-medium text-gray-600 px-3 py-2 hover:bg-gray-50 rounded-lg"
          >
            Features
          </a>
          <a
            href="#about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-medium text-gray-600 px-3 py-2 hover:bg-gray-50 rounded-lg"
          >
            About
          </a>
          <div className="pt-2 border-t border-gray-200 flex flex-col gap-2">
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-center font-semibold text-gray-600 text-sm py-2"
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-center font-bold text-white text-sm py-2.5 rounded-lg"
              style={{ backgroundColor: "#008a66" }}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section
        className="relative overflow-hidden pt-12 pb-24 px-4 md:px-12"
        id="home"
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 z-10 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800">
              <Sparkles size={14} />
              <span className="text-[10px] font-bold tracking-wider uppercase">
                NEW: AI-POWERED ANALYTICS
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-none">
              Modernize Your{" "}
              <span className="text-primary" style={{ color: "#008a66" }}>
                Restaurant
              </span>{" "}
              Operations
            </h1>

            <p className="text-gray-600 text-base md:text-lg max-w-xl leading-relaxed">
              RestoManager is the all-in-one hospitality engine built to
              streamline your kitchen, delight your guests, and grow your bottom
              line with precision.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="text-white text-sm font-bold px-8 py-4 rounded-full hover:bg-emerald-800 transition-all shadow-md flex items-center gap-2 group"
                style={{ backgroundColor: "#008a66" }}
              >
                Start Free Trial
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                to="/book-demo"
                className="bg-white border text-sm font-bold px-8 py-4 rounded-full transition-all"
                style={{ color: "#008a66", borderColor: "#008a66" }}
              >
                Book a Demo
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                <div
                  className="w-10 h-10 rounded-full border-2 border-white bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBuvFDTQObNJrndzLVzmi8jeL7Xe9tK8NPuva08wN6PjjW5bNCmiJ2veyBTG4rYzc9zWpTiGrth9peTForJBArAgTdCRkQcJ3Ol9hF-wQu7tGkfS9ONNmEh8wU7NbXFv3DnAEDJYUar1IcdavMiHtAy6tb6EJ1EnAnSaK97GsnyqmmTDYgygQgRaJmmRqshWZTIzLHZzJ9dpHwT30jYX1vRJD-5nv1ophVdfxrd-RNAMsRdXhWVvCIrQMKr0PZkbI4gEqmaCX6pHrI')",
                  }}
                ></div>
                <div
                  className="w-10 h-10 rounded-full border-2 border-white bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBJDuBuB6_fTCC4se067jVnK0X0OKO4G0XrZoTBBUQAGmLY8PQUrE15HUPZulrXUe2LezVq6xEEWIyMzwUa35Y576lhSKmfvAjq8uCyGfncrcxNNws5EO6zdiZx7LhiuT8Rz4uHze8Qh6Kp04c8-y51Con8LHeohMVb3BgiG97WsULwLAXCZ3ndOwl1XdtDDGPLTHsdYjTIJZZEc02ThYgCtzaVS29QZ3Bx11N9yiG57qAeMSQCgAcnfM4pfkuGWOv4lKmEv82zndc')",
                  }}
                ></div>
                <div
                  className="w-10 h-10 rounded-full border-2 border-white bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB96v9g6u9twpHoOu9amkr4oMTzKQKC2LujZtdhCWzCtpv2l9PI4TGTF-onpCJ9IUZfcq1i1Mu3W9VA_FaTj4cYlAv2S7Fs6rmeSPgYi6OdV1ORi5INFpiA8ifrNccv-h9PDrvkHRXz6rIUyQdVcSPiXpF1oYBSE59jcQA1FtHD5ZniSmTd2d_mSIxuGYrRAD7AKxoEAcJNa7j5fsNH_Z7-4SnjTLIg-dib_M0Uc0YUkqV0L5yR3DvyGsm2AnmcjxbTtnrI2i82y_o')",
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 font-medium">
                Trusted by{" "}
                <span className="text-slate-800 font-bold">2,500+</span>{" "}
                kitchens worldwide
              </p>
            </div>
          </div>

          <div className="flex-1 w-full relative">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl"></div>

            {/* Product Mockup Preview */}
            <div className="relative bg-white/70 backdrop-blur-md rounded-[2rem] p-4 shadow-2xl overflow-hidden border border-gray-200/50 transform lg:rotate-2 hover:rotate-0 transition-all duration-500">
              <div className="bg-slate-50 rounded-xl overflow-hidden border border-gray-200 shadow-inner">
                <div className="h-8 bg-gray-200/50 flex items-center px-4 gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                </div>
                <div className="p-4 bg-white">
                  <div
                    className="aspect-video w-full rounded-lg bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD9lC0QUVMGAZ6WxGjQVjSJl27q5ZqQr4w5lEtW0ISwcJIx9acyAIYpfX1n0-mLTHxyF72WnDZ-LzYZVo-LVAeEa2YbvcXsIltkyyxR1V4YtZz52mSmU27V_PPrZlJS-y6g_Zc3PKRit03UhVxZp_x2ytiqI7NpfESbzjUy5Ag-k7fbs_CF-9fe-peLGQQnQuhx0njZhw-gp2qt4_fvZnj_jEZz7secE7SaDTQQkErhIf33wyclDlxUuxl5i3WrwZrBzeSjhpG9HVI')",
                    }}
                  ></div>
                </div>
              </div>

              {/* Floating Widget 1 */}
              <div
                className="absolute -left-4 top-1/4 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-emerald-100 flex items-center gap-3 animate-bounce"
                style={{ animationDuration: "6s" }}
              >
                <div
                  className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-primary"
                  style={{ color: "#008a66" }}
                >
                  <CheckCircle size={18} />
                </div>
                <div className="text-left">
                  <p className="text-[9px] text-gray-400 uppercase tracking-wider font-bold">
                    Recent Order
                  </p>
                  <p className="text-xs font-bold text-slate-800">
                    Table 12: $142.50
                  </p>
                </div>
              </div>

              {/* Floating Widget 2 */}
              <div
                className="absolute -right-2 bottom-12 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-gray-200 flex flex-col gap-1.5 animate-pulse"
                style={{ animationDuration: "4s" }}
              >
                <p className="text-[10px] font-bold text-gray-500 text-left">
                  Peak Efficiency
                </p>
                <div className="flex items-end gap-1 h-10">
                  <div className="w-2 bg-emerald-100 rounded-t h-1/3"></div>
                  <div className="w-2 bg-emerald-200 rounded-t h-1/2"></div>
                  <div className="w-2 bg-emerald-400 rounded-t h-4/5"></div>
                  <div
                    className="w-2 bg-emerald-600 rounded-t h-full"
                    style={{ backgroundColor: "#008a66" }}
                  ></div>
                  <div className="w-2 bg-emerald-200 rounded-t h-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-24 px-4 md:px-12 bg-slate-50" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Precision Tools for Busy Services
            </h2>
            <p className="text-gray-500 text-base max-w-2xl mx-auto leading-relaxed">
              Built for the noise and heat of the kitchen, designed for the
              quiet sophistication of the front office.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1: Order Management */}
            <div className="md:col-span-2 bg-white p-6 md:p-8 rounded-[20px] shadow-sm border border-gray-200 hover:border-emerald-500 transition-all group overflow-hidden relative">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-4 text-left">
                  <div
                    className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-primary group-hover:bg-emerald-600 group-hover:text-white transition-all"
                    style={{ color: "#008a66" }}
                  >
                    <FileText size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Dynamic Order Management
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Manage tables, takeout, and delivery from a single pane of
                    glass. Sync your POS with kitchen displays in real-time to
                    eliminate errors.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                      <CheckCircle
                        size={16}
                        className="text-primary"
                        style={{ color: "#008a66" }}
                      />{" "}
                      Instant Sync across all devices
                    </li>
                    <li className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                      <CheckCircle
                        size={16}
                        className="text-primary"
                        style={{ color: "#008a66" }}
                      />{" "}
                      Automated table-turn predictions
                    </li>
                  </ul>
                </div>
                <div className="flex-1 h-64 bg-gray-100 rounded-xl relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDcSK1WJjZYgj-jUyMdwZHm1iYv5mfCgGP0TosRzQvT4Zx24ImS7wEG4owuhAXRaUefhEkF6w-ENT6KH4RT8ezMLl7rYKce3f8wTPJs45A3r3NyU5VBf5gbQn9HvbmTal5_T9UpmJeoLASgrOeFWrox_g_KShI7PGZLlcqNYrmK8x3l7dFHTMerK1aK2dcEGYLDV38RRo1BG8ceKPlNriZOS2BEa_9fbyA50cN7_yaqpHTceHo6xWMgaO5C7w-JdRxRtF7-1l1t7JU')",
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Feature 2: Analytics */}
            <div className="bg-white p-6 md:p-8 rounded-[20px] shadow-sm border border-gray-200 hover:border-emerald-500 transition-all group flex flex-col text-left">
              <div
                className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all"
                style={{ color: "#008a66" }}
              >
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Deep Analytics
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-6">
                Uncover your most profitable dishes and peak hours with
                automated reporting that actually makes sense.
              </p>
              <div className="mt-auto bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="flex justify-between items-end gap-1.5 h-24">
                  <div
                    className="w-full bg-emerald-200 rounded-sm"
                    style={{ height: "60%" }}
                  ></div>
                  <div
                    className="w-full bg-emerald-300 rounded-sm"
                    style={{ height: "45%" }}
                  ></div>
                  <div
                    className="w-full bg-emerald-100 rounded-sm"
                    style={{ height: "85%" }}
                  ></div>
                  <div
                    className="w-full bg-emerald-600 rounded-sm"
                    style={{ height: "100%", backgroundColor: "#008a66" }}
                  ></div>
                  <div
                    className="w-full bg-emerald-200 rounded-sm"
                    style={{ height: "70%" }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Feature 3: Menu Builder */}
            <div className="bg-white p-6 md:p-8 rounded-[20px] shadow-sm border border-gray-200 hover:border-emerald-500 transition-all group text-left flex flex-col justify-between">
              <div>
                <div
                  className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all"
                  style={{ color: "#008a66" }}
                >
                  <Plus size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Visual Menu Builder
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-6">
                  Create stunning digital and print menus. Update prices and
                  availability across all platforms with one click.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-auto">
                <div
                  className="h-20 bg-gray-100 rounded-lg bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA6peeul9fIZgU-piQ1aIXHAgmGjdxCWpYC0hTZ4S3MID_4peQaSt72gx7XoznEB4DIr3UKrF3GOnv6GuzG_KSAC2mY9EzGS8bqOLAxuc1xWxlKVv4KmQP_8QBC8w68av5m9MEJ8FVvoqk3fKhGQz41-VoH8hMSlr8cNFYrrKMuZaV60W-kOGixYVIm-SXZm-LbuIfE5hz9E9E3UkEojFBfIf7DSgg2xIQIhJn41rmPGOwNkaltCSPBe_7lLW9VtzuOer06GEZsiXc')",
                  }}
                ></div>
                <div
                  className="h-20 bg-gray-100 rounded-lg bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAMSGZ1lROWKEVkArS0nR2z8u0LJeO2CA1sg_s0EeKgKKFHJei5CiV063SYXVoD0LIru8P3zfuXV0pvXtq00ihEeJ0c8gQa_gIWqLzawo9upUrS24mUmPubAYwlbsgtzx3J3DEJgNePwl7-Iu9z4912Nq098sdHHVFFLxWyKGkMiBEQIl9wN-l_XZ2fqLyAgLmLGWaVQgBR7l3wPVX08oH2evTQSOueodukOPTl_hTin4lBA5BxLdU_mAqYuJQoqwkgtnaC7vtlcjw')",
                  }}
                ></div>
              </div>
            </div>

            {/* Feature 4: Staffing */}
            <div className="md:col-span-2 bg-slate-900 text-white p-6 md:p-8 rounded-[20px] shadow-sm relative overflow-hidden flex flex-col justify-between text-left">
              <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 bg-gradient-to-l from-emerald-500 to-transparent pointer-events-none"></div>
              <div className="relative z-10 md:w-1/2 space-y-4">
                <div
                  className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: "#008a66" }}
                >
                  <Sparkles size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Smart Staff Scheduling
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  AI-driven labor forecasting helps you staff perfectly for
                  every shift, reducing waste and burnout.
                </p>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1 text-emerald-200 font-bold text-xs hover:translate-x-1.5 transition-transform"
                >
                  Explore Labor Management <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 md:px-12" id="about">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Owner Flow */}
            <div className="space-y-12 text-left">
              <div className="space-y-3">
                <span
                  className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block"
                  style={{ color: "#008a66" }}
                >
                  FOR OPERATORS
                </span>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  Streamline the Backend
                </h2>
              </div>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div
                    className="shrink-0 w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm"
                    style={{ backgroundColor: "#008a66" }}
                  >
                    1
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-800 mb-1">
                      Configure Your Space
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Upload your floor plan and menu in minutes using our
                      intuitive wizard.
                    </p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div
                    className="shrink-0 w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm"
                    style={{ backgroundColor: "#008a66" }}
                  >
                    2
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-800 mb-1">
                      Onboard Your Team
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Assign roles and permissions. Staff can download the
                      mobile app for instant notifications.
                    </p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div
                    className="shrink-0 w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm"
                    style={{ backgroundColor: "#008a66" }}
                  >
                    3
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-800 mb-1">
                      Monitor Live Health
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Track sales, labor costs, and guest sentiment in real-time
                      from your executive dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Flow */}
            <div className="space-y-12 text-left">
              <div className="space-y-3">
                <span
                  className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block"
                  style={{ color: "#008a66" }}
                >
                  FOR CUSTOMERS
                </span>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  Elevate the Guest Experience
                </h2>
              </div>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-800 mb-1">
                      Seamless Reservations
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Guests book directly through your site or social media
                      with no third-party fees.
                    </p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-800 mb-1">
                      Contactless Dining
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Order and pay from the table using dynamic QR codes that
                      sync to the kitchen.
                    </p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-800 mb-1">
                      Loyalty & Personalization
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Earn rewards and receive tailored offers based on previous
                      visits and preferences.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 md:px-12">
        <div
          className="max-w-4xl mx-auto rounded-[32px] p-8 md:p-12 text-center text-white relative overflow-hidden bg-emerald-700"
          style={{ backgroundColor: "#008a66" }}
        >
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
          <div className="relative z-10 space-y-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Ready to serve better?
            </h2>
            <p className="text-sm text-emerald-100 max-w-xl mx-auto leading-relaxed">
              Join the future of hospitality. Get started today and see the
              difference in your first week.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/register"
                className="bg-white font-bold px-8 py-4 rounded-full hover:bg-emerald-50 transition-all shadow-md text-sm text-emerald-800"
              >
                Get Started Now
              </Link>
              <Link
                to="/book-demo"
                className="bg-emerald-800 border border-emerald-600/30 text-white font-bold px-8 py-4 rounded-full hover:bg-opacity-80 transition-all text-sm"
              >
                Schedule a Private Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-20 pb-10 px-4 md:px-12 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6 text-left">
              <Link
                to="/"
                className="text-xl font-bold text-primary block"
                style={{ color: "#008a66" }}
              >
                RestoManager
              </Link>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                Empowering the culinary world with professional tools that
                bridge the gap between passion and profitability.
              </p>
              <div className="flex gap-4">
                <a
                  className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 transition-colors text-white"
                  href="#"
                  aria-label="Website"
                >
                  <span className="text-xs">🌐</span>
                </a>
                <a
                  className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 transition-colors text-white"
                  href="#"
                  aria-label="Share"
                >
                  <span className="text-xs">🔗</span>
                </a>
              </div>
            </div>

            <div className="text-left">
              <h5 className="text-sm font-bold text-white mb-6">Product</h5>
              <ul className="space-y-4 text-xs font-medium text-slate-400">
                <li>
                  <Link
                    to="/register"
                    className="hover:text-white transition-colors"
                  >
                    Order Management
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="hover:text-white transition-colors"
                  >
                    Menu Builder
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="hover:text-white transition-colors"
                  >
                    POS Integration
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="hover:text-white transition-colors"
                  >
                    Analytics
                  </Link>
                </li>
              </ul>
            </div>

            <div className="text-left">
              <h5 className="text-sm font-bold text-white mb-6">Company</h5>
              <ul className="space-y-4 text-xs font-medium text-slate-400">
                <li>
                  <a
                    className="hover:text-white transition-colors"
                    href="#about"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-white transition-colors"
                    href="#features"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a className="hover:text-white transition-colors" href="#">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a className="hover:text-white transition-colors" href="#">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            <div className="text-left space-y-4">
              <h5 className="text-sm font-bold text-white">Stay Updated</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Get the latest restaurant management insights delivered weekly.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-8 text-xs text-slate-400 font-medium">
              <a className="hover:text-white transition-colors" href="#">
                Help Center
              </a>
              <a className="hover:text-white transition-colors" href="#">
                Support
              </a>
              <a className="hover:text-white transition-colors" href="#">
                API Docs
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
