"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Check, Image as ImageIcon, Link as LinkIcon, Sparkles } from "lucide-react";

interface ImageUploadProps {
  name: string;
  label: string;
  defaultValue?: string | null;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  helperText?: string;
}

export function ImageUpload({
  name,
  label,
  defaultValue = "",
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.82,
  helperText,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(defaultValue || "");
  const [isCompressing, setIsCompressing] = useState(false);
  const [stats, setStats] = useState<{ originalSize: string; compressedSize: string; savings: string } | null>(null);
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function formatBytes(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }

  // Compactação inteligente no navegador usando HTML5 Canvas e WebP
  async function compressImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          // Redimensionamento proporcional
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Converte para WebP de alta eficiência
          const compressedDataUrl = canvas.toDataURL("image/webp", quality);

          // Calcula tamanho aproximado em bytes
          const head = "data:image/webp;base64,";
          const compressedBytes = Math.round(((compressedDataUrl.length - head.length) * 3) / 4);
          const originalBytes = file.size;
          const savingsPercent = Math.max(0, Math.round(((originalBytes - compressedBytes) / originalBytes) * 100));

          setStats({
            originalSize: formatBytes(originalBytes),
            compressedSize: formatBytes(compressedBytes),
            savings: `${savingsPercent}%`,
          });

          resolve(compressedDataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      const compressedWebp = await compressImage(file);
      setPreview(compressedWebp);
    } catch (err) {
      console.error("Erro ao compactar imagem:", err);
    } finally {
      setIsCompressing(false);
    }
  }

  function handleRemove() {
    setPreview("");
    setStats(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          {label}
        </label>
        <div className="flex items-center gap-1 text-[11px]">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`px-2 py-0.5 rounded font-semibold transition-colors ${
              mode === "upload" ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Upload + Otimização
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-2 py-0.5 rounded font-semibold transition-colors ${
              mode === "url" ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            URL Direta
          </button>
        </div>
      </div>

      {/* Input escondido que envia o valor no formulário */}
      <input type="hidden" name={name} value={preview} />

      {mode === "upload" ? (
        <div className="space-y-3">
          {preview ? (
            <div className="relative rounded-xl border border-slate-200 bg-slate-900/5 p-3 flex items-center gap-4 overflow-hidden">
              <div className="relative h-20 w-28 rounded-lg overflow-hidden border border-slate-200 bg-slate-900 shrink-0">
                <Image
                  src={preview}
                  alt={label}
                  fill
                  className="object-contain p-1"
                  unoptimized
                />
              </div>

              <div className="flex-1 min-w-0 text-xs">
                {stats ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                      <Sparkles size={14} />
                      <span>Compactado com Sucesso (WebP)</span>
                    </div>
                    <div className="text-slate-600">
                      {stats.originalSize} $\rightarrow$ <span className="font-bold text-slate-900">{stats.compressedSize}</span>
                    </div>
                    <div className="text-[11px] font-bold text-emerald-600">
                      Economia de {stats.savings} de tráfego
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-600">Imagem ativa configurada</div>
                )}
              </div>

              <button
                type="button"
                onClick={handleRemove}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Remover imagem"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="group border-2 border-dashed border-slate-300 hover:border-slate-800 rounded-xl p-6 text-center cursor-pointer transition-all bg-slate-50/50 hover:bg-white"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="p-3 rounded-xl bg-white shadow-sm border border-slate-200 text-slate-700 group-hover:scale-110 transition-transform">
                  <Upload size={22} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900">
                    {isCompressing ? "Compactando e Otimizando Imagem..." : "Clique para selecionar ou arraste a imagem"}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Conversão automática para WebP ultra-leve (PNG, JPG até 15MB)
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="relative">
            <input
              type="url"
              value={preview}
              onChange={(e) => setPreview(e.target.value)}
              placeholder="https://exemplo.com/imagem.png"
              className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-sm"
            />
            <LinkIcon size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
          </div>
          {preview && (
            <div className="relative h-16 w-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-900">
              <Image src={preview} alt="Preview" fill className="object-contain p-1" unoptimized />
            </div>
          )}
        </div>
      )}

      {helperText && <p className="text-[11px] text-slate-500">{helperText}</p>}
    </div>
  );
}
