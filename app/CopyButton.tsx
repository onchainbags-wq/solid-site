"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-semibold"
    >
      {copied ? "Copied!" : "Copy CA"}
    </button>
  );
}

