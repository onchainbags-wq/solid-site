"use client";

import { useMemo, useState } from "react";

function shortCa(ca: string) {
  const s = (ca || "").trim();
  if (s.length <= 16) return s;
  return `${s.slice(0, 6)}…${s.slice(-6)}`;
}

export default function CopyCA({ ca }: { ca: string }) {
  const [copied, setCopied] = useState(false);

  const display = useMemo(() => shortCa(ca), [ca]);

  async function doCopy() {
    try {
      await navigator.clipboard.writeText(ca);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // fallback: no-op (mobile browsers sometimes block clipboard)
      setCopied(false);
    }
  }

  return (
    <div
      className="rounded-2xl bg-[#0b1730]/70 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.35)] ring-1 ring-white/5"
      role="button"
      tabIndex={0}
      onClick={doCopy}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") doCopy();
      }}
      aria-label="Copy contract address"
    >
      <p className="text-[11px] text-white/35">Contract Address</p>

      <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-white/10 px-4 py-3">
        <div className="min-w-0 text-left">
          <p className="text-[10px] text-white/35">Tap to copy</p>
          <code className="block truncate text-sm text-white/85">
            {display}
          </code>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            doCopy();
          }}
          className="shrink-0 rounded-lg bg-white/15 px-3 py-2 text-xs font-semibold text-white/85 hover:bg-white/20 active:scale-[0.99]"
        >
          {copied ? "Copied!" : "Copy CA"}
        </button>
      </div>

      <p className="mt-3 text-[11px] text-white/25">
        Verify CA in Telegram pinned
      </p>
    </div>
  );
}

