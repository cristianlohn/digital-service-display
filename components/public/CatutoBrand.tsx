import React from "react";
import Image from "next/image";

interface CatutoBrandProps {
  className?: string;
  variant?: "horizontal" | "badge" | "compact";
}

export function CatutoBrand({ className = "", variant = "badge" }: CatutoBrandProps) {
  return (
    <a
      href="https://catuto.com.br"
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center gap-3 transition-all duration-300 ${
        variant === "badge"
          ? "rounded-xl bg-[#121212] hover:bg-[#1a1a1a] px-3.5 py-2 border border-slate-800 hover:border-[#00FF41]/40 shadow-lg hover:shadow-[#00FF41]/10"
          : "hover:opacity-90"
      } ${className}`}
      aria-label="Desenvolvido por Catuto Soluções Digitais"
    >
      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
        <span>Desenvolvido por</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Neon Green Geometric Icon */}
        <div className="relative flex items-center justify-center">
          <svg
            viewBox="0 0 90 100"
            className="h-6 w-5 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(0,255,65,0.6)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Top Diamond 1 */}
            <polygon
              points="45,5 68,28 45,51 22,28"
              stroke="#00FF41"
              strokeWidth="5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Top Diamond 2 (Interlocking) */}
            <polygon
              points="45,22 68,45 45,68 22,45"
              stroke="#00FF41"
              strokeWidth="5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Lower Loop Shape */}
            <path
              d="M 18,52 C 12,64 12,82 24,92 C 36,102 54,102 66,92 C 78,82 78,64 72,52"
              stroke="#00FF41"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Inner Slash */}
            <polygon
              points="30,80 45,64 56,74 41,90"
              stroke="#00FF41"
              strokeWidth="4"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Brand Typography */}
        <div className="flex flex-col text-left font-['Montserrat',sans-serif]">
          <span className="text-xs font-black tracking-wider text-white leading-none group-hover:text-[#00FF41] transition-colors">
            CATUTO
          </span>
          <span className="text-[9px] font-medium tracking-normal text-[#00FF41] leading-tight">
            Soluções Digitais
          </span>
        </div>
      </div>
    </a>
  );
}
