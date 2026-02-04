export const runtime = "nodejs";

import fs from "fs";
import path from "path";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CopyCA from "./copy-ca";

type Coin = {
  name: string;
  ticker: string; // e.g. "$SOLID"
  tagline: string; // e.g. "still solid."
  ca: string;
  image?: string; // e.g. "/images/solid.png"
  links: {
    buy?: string; // pump.fun
    dexscreener?: string;
    x?: string;
    telegram?: string;
    axiom?: string;
    gmgn?: string;
  };
};

function loadCoin(slug: string): Coin | null {
  const filePath = path.join(process.cwd(), "characters", `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function safeHref(href?: string) {
  if (!href) return null;
  const trimmed = href.trim();
  if (!trimmed || trimmed === "#") return null;
  return trimmed;
}

function Btn({
  href,
  label,
  variant = "secondary",
  full = false,
}: {
  href?: string | null;
  label: string;
  variant?: "primary" | "secondary";
  full?: boolean;
}) {
  const enabled = !!href;

  const base =
    "inline-flex items-center justify-center rounded-xl font-semibold transition " +
    "focus:outline-none focus:ring-2 focus:ring-white/20 active:scale-[0.99]";

  const size = full ? "w-full py-4 text-base" : "w-full py-3 text-sm";

  const styles =
    variant === "primary"
      ? "bg-emerald-400/95 text-black hover:bg-emerald-400 shadow-[0_12px_40px_rgba(16,185,129,0.25)]"
      : "bg-white text-black hover:bg-white/90";

  const disabled =
    "bg-white/10 text-white/40 cursor-not-allowed hover:bg-white/10";

  if (!enabled) {
    return (
      <span className={`${base} ${size} ${disabled}`} aria-disabled="true">
        {label}
      </span>
    );
  }

  return (
    <a
      href={href!}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${size} ${styles}`}
    >
      {label}
    </a>
  );
}

export default async function CoinPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const coin = loadCoin(slug);
  if (!coin) return notFound();

  const buy = safeHref(coin.links?.buy);
  const dex = safeHref(coin.links?.dexscreener);
  const x = safeHref(coin.links?.x);
  const tg = safeHref(coin.links?.telegram);
  const axiom = safeHref(coin.links?.axiom);
  const gmgn = safeHref(coin.links?.gmgn);

  const hero = coin.image ?? "/images/hero.png";

  return (
    <main className="min-h-screen bg-[#06070a] text-white">
      {/* Ambient background (from your globals.css) */}
      <div className="bg-solid-ambient min-h-screen">
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center px-5 pb-10 pt-10 text-center">
          {/* HERO */}
          <div className="relative mt-2">
            {/* glow plate */}
            <div className="solid-hero-glow absolute -inset-10 rounded-full blur-2xl opacity-90" />

            {/* hero float */}
            <div className="solid-hero-float relative">
              <Image
                src={hero}
                alt={coin.name}
                width={420}
                height={420}
                priority
                className="h-auto w-[260px] select-none sm:w-[320px]"
              />
            </div>
          </div>

          {/* CAPTION ORDER */}
          <div className="mt-6 space-y-2">
            <p className="text-xs tracking-wide text-white/45">
              market dumping?
            </p>

            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
              {coin.ticker}
            </h1>

            <p className="text-base text-white/55">{coin.tagline}</p>
          </div>

          {/* CA BOX */}
          <div className="mt-8 w-full max-w-xl">
            <CopyCA ca={coin.ca} />
          </div>

          {/* BUY */}
          <div className="mt-5 w-full max-w-xl">
            <Btn href={buy} label="Buy on pump.fun" variant="primary" full />

            {/* ONE trust nudge line */}
            <p className="mt-2 text-xs text-white/40">
              Fair launch • No presale • No insiders
            </p>

            {/* Advanced traders */}
            {(axiom || gmgn) && (
              <p className="mt-2 text-xs text-white/35">
                Advanced:{" "}
                {axiom ? (
                  <a
                    className="underline underline-offset-2 hover:text-white/70"
                    href={axiom}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Axiom
                  </a>
                ) : (
                  <span className="text-white/25">Axiom</span>
                )}
                <span className="mx-2 text-white/20">•</span>
                {gmgn ? (
                  <a
                    className="underline underline-offset-2 hover:text-white/70"
                    href={gmgn}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GMGN
                  </a>
                ) : (
                  <span className="text-white/25">GMGN</span>
                )}
              </p>
            )}
          </div>

          {/* LINKS */}
          <div className="mt-6 grid w-full max-w-xl grid-cols-2 gap-4">
            <Btn href={dex} label="DexScreener" />
            <Btn href={x} label="X" />
            <div className="col-span-2">
              <Btn href={tg} label="Telegram" />
            </div>
          </div>

          {/* tiny footer */}
          <div className="mt-8 text-[11px] text-white/25">
            <span>Verify CA in Telegram pinned</span>
            <span className="mx-2">•</span>
            <Link className="underline underline-offset-2" href="/">
              Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

