// app/[slug]/page.tsx
import fs from "fs";
import path from "path";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CopyCA from "./copy-ca";

type Coin = {
  slug: string;
  name?: string;
  ticker?: string;

  // assets
  image?: string; // e.g. "/images/solid.png"

  // copy
  captionTop?: string; // "market dumping?"
  captionMid?: string; // "$SOLID"
  captionBottom?: string; // "still solid."

  // links
  ca?: string;
  buyUrl?: string; // pump.fun link
  chartUrl?: string; // dexscreener
  xUrl?: string;
  telegramUrl?: string;

};

function loadCoin(slug: string): Coin | null {
  // characters/<slug>.json
  const filePath = path.join(process.cwd(), "characters", `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(raw) as Partial<Coin>;
  return {
    slug,
    ...data,
  } as Coin;
}

function isValidHttpUrl(u?: string) {
  if (!u) return false;
  try {
    const x = new URL(u);
    return x.protocol === "http:" || x.protocol === "https:";
  } catch {
    return false;
  }
}

function ExternalButton({
  href,
  children,
  variant = "ghost",
  full = false,
}: {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  full?: boolean;
}) {
  const enabled = isValidHttpUrl(href);

  const base =
    "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 " +
    "active:scale-[0.99] disabled:opacity-60";

  const styles =
    variant === "primary"
      ? enabled
        ? "bg-emerald-500 text-black shadow-[0_12px_40px_rgba(16,185,129,0.25)] hover:bg-emerald-400"
        : "bg-white/10 text-white/40"
      : enabled
        ? "bg-white text-black hover:bg-white/90"
        : "bg-white/10 text-white/35";

  const width = full ? "w-full" : "w-full";

  // If link is missing, render a non-clickable div (no event handlers needed)
  if (!enabled) {
    return (
      <div
        aria-disabled="true"
        className={`${base} ${styles} ${width} cursor-not-allowed`}
      >
        {children}
      </div>
    );
  }

  return (
    <Link
      href={href!}
      target="_blank"
      rel="noreferrer"
      className={`${base} ${styles} ${width}`}
    >
      {children}
    </Link>
  );
}

export default async function CoinPage({
  params,
}: {
  // Next can pass params as a Promise in newer versions
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const coin = loadCoin(slug);
  if (!coin) return notFound();

  const captionTop = coin.captionTop ?? "market dumping?";
  const captionMid = coin.captionMid ?? (coin.ticker ? `${coin.ticker}` : "$SOLID");
  const captionBottom = coin.captionBottom ?? "still solid.";

  const imageSrc = coin.image ?? "/images/solid.png";

  const buyEnabled = isValidHttpUrl(coin.buyUrl);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* background wash */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_50%_18%,rgba(16,185,129,0.18),rgba(59,130,246,0.10),rgba(0,0,0,0)_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(700px_420px_at_64%_14%,rgba(168,85,247,0.14),rgba(0,0,0,0)_60%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/60 to-black" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[980px] flex-col items-center px-6 pb-16 pt-16">
        {/* HERO */}
        <div className="relative mb-8 mt-2 flex w-full flex-col items-center">
          {/* glow behind hero */}
          <div className="pointer-events-none absolute -top-6 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl animate-pulse" />
          <div className="pointer-events-none absolute -top-2 h-56 w-56 rounded-full bg-sky-500/10 blur-3xl" />

          <div className="relative">
            <Image
              src={imageSrc}
              alt={coin.name ?? slug}
              width={420}
              height={420}
              priority
              className="h-auto w-[240px] sm:w-[300px] md:w-[340px] select-none drop-shadow-[0_18px_60px_rgba(0,0,0,0.55)]"
            />
          </div>

          {/* CAPTION STACK (below image) */}
          <div className="mt-3 flex flex-col items-center gap-2 text-center">
            <div className="text-[11px] tracking-wide text-white/40">
              {captionTop}
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              {captionMid}
            </h1>

            <div className="text-sm font-medium text-white/55">
              {captionBottom}
            </div>
          </div>
        </div>

        {/* CA BOX */}
        <div className="w-full max-w-[540px] rounded-2xl bg-[#0B1324]/85 p-5 shadow-[0_18px_70px_rgba(0,0,0,0.55)] ring-1 ring-white/5 backdrop-blur">
          <div className="mb-2 text-center text-[11px] font-medium text-white/35">
            Contract Address
          </div>

          <CopyCA ca={coin.ca ?? "CA_GOES_HERE"} />

          <div className="mt-2 text-center text-[11px] text-white/25">
            Verify CA in Telegram pinned
          </div>
        </div>

        {/* BUY */}
        <div className="mt-6 w-full max-w-[540px]">
          <ExternalButton href={coin.buyUrl} variant="primary" full>
            {buyEnabled ? "Buy on pump.fun" : "Buy (link goes live at launch)"}
          </ExternalButton>

          {/* ONE trust nudge line (do not duplicate elsewhere) */}
          <div className="mt-2 text-center text-[11px] text-white/35">
            Powered by ChainDeployer Automate
          </div>

        {/* LINKS */}
        <div className="mt-6 w-full max-w-[540px]">
          <div className="grid grid-cols-2 gap-3">
            <ExternalButton href={coin.chartUrl} variant="ghost">
              DexScreener
            </ExternalButton>
            <ExternalButton href={coin.xUrl} variant="ghost">
              X
            </ExternalButton>
          </div>

          <div className="mt-3">
            <ExternalButton href={coin.telegramUrl} variant="ghost" full>
              Telegram
            </ExternalButton>
          </div>
        </div>
      </div>
    </main>
  );
}

