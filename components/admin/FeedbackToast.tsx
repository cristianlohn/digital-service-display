"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, X, Sparkles } from "lucide-react";

interface FeedbackToastProps {
  status?: "success" | "error" | null;
  message?: string | null;
  onClose?: () => void;
}

export function FeedbackToast({ status, message, onClose }: FeedbackToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (status && message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [status, message, onClose]);

  if (!visible || !status || !message) return null;

  return (
    <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
      <div
        className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-xl ${
          status === "success"
            ? "bg-slate-950/95 text-white border-emerald-500/40 shadow-emerald-500/10"
            : "bg-rose-950/95 text-white border-rose-500/40 shadow-rose-500/10"
        }`}
      >
        <div
          className={`p-2 rounded-xl ${
            status === "success" ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
          }`}
        >
          {status === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
        </div>

        <div className="text-xs">
          <div className="font-bold flex items-center gap-1.5">
            <span>{status === "success" ? "Sucesso!" : "Atenção"}</span>
            {status === "success" && <Sparkles size={12} className="text-emerald-400" />}
          </div>
          <div className="text-slate-300 mt-0.5">{message}</div>
        </div>

        <button
          onClick={() => {
            setVisible(false);
            if (onClose) onClose();
          }}
          className="ml-2 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
