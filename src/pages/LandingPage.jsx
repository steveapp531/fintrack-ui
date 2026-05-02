// ============================================================
//  src/pages/LandingPage.jsx — Marketing Landing Page
//
//  Sections: Hero → Live Counter → How It Works →
//            Who It's For → Pricing → CTA footer
//
//  The statement counter calls GET /api/stats/public and
//  animates from 0 to the real number returned by the DB.
// ============================================================

import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { getPublicStats } from "../utils/api.js";

// ── Animated counter hook ─────────────────────────────────────
function useCountUp(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    if (!target) return;
    const start = performance.now();
    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return count;
}

// ── Sub-components ────────────────────────────────────────────

function NavBar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
            <span className="text-slate-950 font-bold text-sm font-mono">F</span>
          </div>
          <span className="text-white font-semibold text-lg">
            Fin<span className="text-emerald-400">Track</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-slate-400 hover:text-white text-sm transition-colors px-3 py-1.5"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400
                       text-slate-950 text-sm font-semibold transition-all
                       shadow-lg shadow-emerald-500/20"
          >
            Start free trial
          </Link>
        </div>
      </div>
    </nav>
  );
}

function HeroSection({ statCount }) {
  const animated = useCountUp(statCount, 1800);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 px-5">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#34d399 1px,transparent 1px),linear-gradient(90deg,#34d399 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Glow orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px]
                      rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* AI badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                        bg-emerald-500/10 border border-emerald-500/20 mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 text-xs font-medium">
            Powered by Google Gemini AI
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6">
          Turn your bank statements into{" "}
          <span className="text-emerald-400">clear business insights</span>
          {" "}in minutes.
        </h1>

        <p className="text-slate-400 text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
          Upload a PDF or CSV bank statement. Our AI instantly extracts, categorises,
          and analyses every transaction — giving you a complete profitability
          picture without any accounting knowledge.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <Link
            to="/register"
            className="px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400
                       text-slate-950 text-base font-bold transition-all
                       shadow-xl shadow-emerald-500/25 w-full sm:w-auto text-center"
          >
            Start your free 14-day trial →
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 rounded-xl border border-slate-700
                       hover:border-slate-600 text-slate-300 hover:text-white
                       text-base transition-all w-full sm:w-auto text-center"
          >
            Sign in
          </Link>
        </div>

        {/* Live counter */}
        <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl
                        bg-slate-900 border border-slate-800">
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400 font-mono tabular-nums">
              {statCount > 0 ? animated.toLocaleString() : "2,000+"}
            </div>
            <div className="text-slate-500 text-xs mt-1">statements analysed</div>
          </div>
          <div className="w-px h-10 bg-slate-700" />
          <div className="text-left">
            <div className="text-slate-300 text-sm font-medium">Real businesses.</div>
            <div className="text-slate-500 text-xs">Real insights.</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SupportingPoints() {
  const points = [
    { icon: "🧾", title: "No accounting knowledge required", desc: "Our AI reads and interprets your statements so you don't have to." },
    { icon: "📊", title: "Instant income vs spending breakdown", desc: "See exactly where every naira or dollar is going, categorised automatically." },
    { icon: "🔍", title: "Identify where your money is going", desc: "Transportation, utilities, salaries, inventory — all separated and ranked." },
    { icon: "📈", title: "Track profitability over time", desc: "Monthly and annual views with trend comparisons and margin tracking." },
  ];

  return (
    <section className="py-24 px-5 bg-slate-900/40">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-white mb-3">
            Everything you need to understand your business finances
          </h2>
          <p className="text-slate-400 text-lg">No spreadsheets. No accountant. Just clarity.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {points.map((p) => (
            <div
              key={p.title}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6
                         hover:-translate-y-1 transition-transform duration-200"
            >
              <div className="text-3xl mb-4">{p.icon}</div>
              <h3 className="text-white font-semibold text-base mb-2">{p.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { num: "01", title: "Create your account", desc: "Sign up in 30 seconds. No credit card required. 14-day free trial starts immediately." },
    { num: "02", title: "Upload your statement", desc: "Drag and drop a PDF or CSV bank statement from any bank." },
    { num: "03", title: "AI categorises everything", desc: "Gemini AI reads every transaction and assigns it to the right category: sales, transport, salaries, utilities, and more." },
    { num: "04", title: "Get your dashboard", desc: "See total income, expenses, net profit, margin, monthly trends, and a personalised financial health report." },
  ];

  return (
    <section className="py-24 px-5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-white mb-3">How it works</h2>
          <p className="text-slate-400">From upload to insight in under 60 seconds.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {steps.map((s) => (
            <div
              key={s.num}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex gap-4"
            >
              <div className="text-emerald-400 font-mono font-bold text-sm opacity-60 w-8 flex-shrink-0 pt-0.5">
                {s.num}
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1.5">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhoItsFor() {
  const profiles = [
    { emoji: "👗", type: "Fashion & Retail", pain: "Mixing personal and business spend. No idea of margins." },
    { emoji: "🚚", type: "Logistics & Transport", pain: "High fuel and maintenance costs eating into revenue." },
    { emoji: "🍽️",  type: "Food & Hospitality", pain: "Variable income, high ingredient costs, unpredictable profit." },
    { emoji: "💼", type: "Professional Services", pain: "Irregular invoicing. Hard to see true monthly performance." },
  ];

  return (
    <section className="py-24 px-5 bg-slate-900/40">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-white mb-3">Built for small business owners</h2>
          <p className="text-slate-400 text-lg">
            Whether you run a shop, a fleet, a kitchen, or a consultancy — if money moves through a bank account, FinTrack can analyse it.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {profiles.map((p) => (
            <div
              key={p.type}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
            >
              <div className="text-3xl mb-3">{p.emoji}</div>
              <h3 className="text-white font-semibold text-sm mb-2">{p.type}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{p.pain}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section className="py-24 px-5" id="pricing">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-white mb-3">Simple pricing</h2>
          <p className="text-slate-400">
            Start with a 14-day free trial. No credit card needed.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Quarterly */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">
            <p className="text-slate-400 text-sm mb-1">Quarterly</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-bold text-white font-mono">$29</span>
              <span className="text-slate-500">/ 3 months</span>
            </div>
            <p className="text-emerald-400 text-xs font-mono mb-6">$9.67/month</p>
            <ul className="space-y-2.5 mb-8">
              {["Unlimited uploads","AI categorisation","Monthly & annual views","Email support"].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="text-emerald-400 text-xs">✓</span>{f}
                </li>
              ))}
            </ul>
            <Link
              to="/register"
              className="block w-full py-3 rounded-xl text-center bg-slate-800
                         hover:bg-slate-700 border border-slate-700
                         text-white text-sm font-semibold transition-all"
            >
              Start free trial
            </Link>
          </div>

          {/* Annual — featured */}
          <div className="relative bg-slate-900 border-2 border-emerald-500/50 rounded-2xl p-7">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="px-4 py-1 rounded-full bg-emerald-500 text-slate-950
                               text-xs font-bold shadow-lg shadow-emerald-500/30">
                Best value
              </span>
            </div>
            <p className="text-slate-400 text-sm mb-1">Annual</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-bold text-white font-mono">$89</span>
              <span className="text-slate-500">/ year</span>
            </div>
            <p className="text-emerald-400 text-xs font-mono mb-6">$7.42/month · Save 23%</p>
            <ul className="space-y-2.5 mb-8">
              {["Everything in Quarterly","Save 23% vs quarterly","Priority support","Early access to new features"].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="text-emerald-400 text-xs">✓</span>{f}
                </li>
              ))}
            </ul>
            <Link
              to="/register"
              className="block w-full py-3 rounded-xl text-center
                         bg-emerald-500 hover:bg-emerald-400
                         text-slate-950 text-sm font-bold transition-all
                         shadow-lg shadow-emerald-500/20"
            >
              Start free trial
            </Link>
          </div>
        </div>

        {/* Trial note */}
        <p className="text-center text-slate-500 text-sm mt-8">
          14-day free trial on all plans. Cancel anytime.
          3-day grace period after expiry — your data is never deleted.
        </p>
      </div>
    </section>
  );
}

function FooterCTA() {
  return (
    <section className="py-24 px-5 border-t border-slate-800">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Stop guessing. Start knowing.
        </h2>
        <p className="text-slate-400 text-lg mb-8">
          Join hundreds of business owners who understand their finances clearly —
          without hiring an accountant.
        </p>
        <Link
          to="/register"
          className="inline-block px-10 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400
                     text-slate-950 font-bold text-lg transition-all
                     shadow-2xl shadow-emerald-500/20"
        >
          Start your free 14-day trial →
        </Link>
        <p className="text-slate-600 text-sm mt-4">No credit card required.</p>
      </div>
    </section>
  );
}

// ── Main Export ───────────────────────────────────────────────
export default function LandingPage() {
  const [statCount, setStatCount] = useState(0);

  // Fetch real count from backend on mount
  useEffect(() => {
    getPublicStats().then((data) => {
      setStatCount(data.statementsAnalysed || 2000);
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 font-sans">
      <NavBar />
      <HeroSection statCount={statCount} />
      <SupportingPoints />
      <HowItWorks />
      <WhoItsFor />
      <PricingSection />
      <FooterCTA />

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-5 text-center">
        <p className="text-slate-600 text-sm">
          © {new Date().getFullYear()} FinTrack · AI Financial Intelligence
        </p>
      </footer>
    </div>
  );
}