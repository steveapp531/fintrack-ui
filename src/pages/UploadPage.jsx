// src/pages/UploadPage.jsx v2 — uses AuthContext for user info
import React, { useEffect, useState } from "react";
import FileUpload from "../components/upload/FileUpload.jsx";
import { useUpload } from "../hooks/useUpload.jsx";
import { checkHealth } from "../utils/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function UploadPage({ onSuccess }) {
  const { upload, state, progress, error, reset } = useUpload();
  const { user, refreshUser } = useAuth();
  const [serverOnline, setServerOnline] = useState(true);

  useEffect(() => { checkHealth().then(setServerOnline); }, []);

  const handleFile = async (file) => {
    const data = await upload(file);
    if (data) {
      await refreshUser(); // Update statement count in header
      onSuccess(data);
    }
  };

  const trialDaysLeft = user?.trialEndsAt
    ? Math.max(0, Math.ceil((new Date(user.trialEndsAt) - Date.now()) / 86400000))
    : null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4">
      <div className="text-center mb-10 max-w-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 text-xs font-medium">Powered by Google Gemini AI</span>
        </div>
        <h1 className="text-4xl font-bold text-white leading-tight mb-3">
          Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}!
        </h1>
        <p className="text-slate-400 text-base leading-relaxed">
          Upload a PDF or CSV bank statement. AI will extract and categorise
          every transaction in seconds.
        </p>
        {user?.subscriptionStatus === "trial" && trialDaysLeft !== null && (
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
            <span className="text-amber-400 text-xs">
              {trialDaysLeft} day{trialDaysLeft !== 1 ? "s" : ""} left in your free trial
            </span>
          </div>
        )}
      </div>

      {!serverOnline && (
        <div className="w-full max-w-lg mb-4 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2">
          <span className="text-amber-400 text-xs">⚠ Backend offline. Run <code className="bg-slate-800 px-1 rounded font-mono">npm run dev</code> in /backend.</span>
        </div>
      )}

      <div className="w-full max-w-lg">
        <FileUpload onFile={handleFile} uploadState={state} progress={progress} error={error} onReset={reset} />
      </div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full">
        {[
          { step: "01", title: "Upload Statement", desc: "PDF or CSV — any major bank format.", icon: "📁" },
          { step: "02", title: "AI Categorises", desc: "Gemini assigns every transaction a category.", icon: "🤖" },
          { step: "03", title: "View Dashboard", desc: "KPIs, trends, and a financial health report.", icon: "📊" },
        ].map((item) => (
          <div key={item.step} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl">{item.icon}</span>
              <span className="text-slate-700 text-xs font-mono font-bold">{item.step}</span>
            </div>
            <p className="text-white text-sm font-medium">{item.title}</p>
            <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}