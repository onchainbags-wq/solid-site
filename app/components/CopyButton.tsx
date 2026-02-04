"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // Fallback (rare, but helps some browsers)
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      } catch {
        // If copy fails, do nothing
      }
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`mt-3 w-full px-4 py-2 rounded-lg text-sm font-semibold transition
        ${copied ? "bg-emerald-500 text-black" : "bg-gray-800 hover:bg-gray-700 text-white"}`}
    >
      {copied ? "Copied ✅" : "Copy CA"}
    </button>
  );
}

