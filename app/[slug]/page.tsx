// app/[slug]/page.tsx
import fs from "fs";
import path from "path";
import Image from "next/image";
import CopyButton from "../components/CopyButton";

type Character = {
  name: string;
  ticker: string;       // e.g. "$SOLID"
  caption: string;      // "market dumping?"
  tagline: string;      // "still solid."
  trustLine?: string;   // optional
  ca: string;           // "CA_GOES_HERE"
  image: string;        // "/images/solid.png"
  links: {
    pumpfun?: string;
    dexscreener?: string;
    x?: string;
    telegram?: string;
  };
};

function loadCharacter(slug: string): Character {
  const filePath = path.join(process.cwd(), "characters", `${slug}.json`);
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw) as Character;
}

function isRealLink(url?: string) {
  return !!url && url !== "#" && url.trim().length > 0;
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = loadCharacter(slug);

  const pumpUrl = c.links?.pumpfun;
  const dexUrl = c.links?.dexscreener;
  const xUrl = c.links?.x;
  const tgUrl = c.links?.telegram;

  const buyIsLive = isRealLink(pumpUrl);
  const dexIsLive = isRealLink(dexUrl);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-140px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[90px]" />
        <div className="absolute right-[-140px] top-[-120px] h-[520px] w-[520px] rounded-full bg-fuchsia-500/10 blur-[100px]" />
        <div className="absolute left-[-160px] top-[120px] h-[520px] w-[520px] rounded-full bg-cyan-500/10 blur-[110px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col items-center px-5 pb-16 pt-10 text-white">
        {/* Hero image */}
        <div className="relative mb-6 mt-2 flex items-center justify-center">
          <div className="absolute -inset-10 rounded-full bg-white/5 blur-2xl" />
          <Image
            src={c.image}
            alt={c.name}
            width={560}
            height={560}
            priority
            className="relative h-auto w-[300px] sm:w-[360px] drop-shadow-[0_12px_45px_rgba(0,0,0,0.65)]"
          />
        </div>

        {/* Copy */}
        <div className="text-center">
          <div className="text-xs tracking-wide text-white/45">{c.caption}</div>

          {/* IMPORTANT: use ticker exactly as stored in JSON (prevents $$) */}
          <h1 className="mt-2 text-5xl font-extrabold tracking-tight sm:text-6xl">
            {c.ticker}
          </h1>

          <div className="mt-2 text-base text-white/55">{c.tagline}</div>
        </div>

        {/* CTA Stack (tighter spacing) */}
        <div className="mt-8 w-full max-w-xl">
          {/* CA Card */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/35 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur">
            <div className="text-center text-xs text-white/40">
              Contract Address
            </div>

            <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[11px] text-white/40">Tap to copy</div>
                  <div className="mt-1 truncate font-mono text-sm text-white/90">
                    {c.ca}
                  </div>
                </div>

                <CopyButton text={c.ca} className="shrink-0" />
              </div>

              <div className="mt-3 text-center text-[11px] text-white/35">
                Verify CA in Telegram pinned
              </div>
            </div>
          </div>

          {/* Buy Button (pulled up closer) */}
          <div className="mt-4">
            <a
              href={buyIsLive ? pumpUrl : "#"}
              target={buyIsLive ? "_blank" : undefined}
              rel={buyIsLive ? "noreferrer" : undefined}
              aria-disabled={!buyIsLive}
              className={[
                "block w-full rounded-2xl px-6 py-4 text-center font-semibold",
                "transition",
                buyIsLive
                  ? "bg-emerald-500 text-black hover:bg-emerald-400"
                  : "bg-white/10 text-white/50",
              ].join(" ")}
            >
              {buyIsLive ? "Buy on pump.fun" : "Buy (link goes live at launch)"}
            </a>

            {/* small footer (kept, tightened) */}
            <div className="mt-2 text-center text-[11px] text-white/35">
              Powered by ChainDeployer Automate
            </div>
          </div>

          {/* Secondary buttons (pulled up, tighter) */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <a
              href={dexIsLive ? dexUrl : "#"}
              target={dexIsLive ? "_blank" : undefined}
              rel={dexIsLive ? "noreferrer" : undefined}
              aria-disabled={!dexIsLive}
              className={[
                "rounded-2xl px-5 py-4 text-center font-medium transition",
                dexIsLive
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-white/10 text-white/50",
              ].join(" ")}
            >
              DexScreener
            </a>

            <a
              href={xUrl || "#"}
              target={isRealLink(xUrl) ? "_blank" : undefined}
              rel={isRealLink(xUrl) ? "noreferrer" : undefined}
              aria-disabled={!isRealLink(xUrl)}
              className={[
                "rounded-2xl px-5 py-4 text-center font-medium transition",
                isRealLink(xUrl)
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-white/10 text-white/50",
              ].join(" ")}
            >
              X
            </a>
          </div>

          <div className="mt-3">
            <a
              href={tgUrl || "#"}
              target={isRealLink(tgUrl) ? "_blank" : undefined}
              rel={isRealLink(tgUrl) ? "noreferrer" : undefined}
              aria-disabled={!isRealLink(tgUrl)}
              className={[
                "block w-full rounded-2xl px-5 py-4 text-center font-medium transition",
                isRealLink(tgUrl)
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-white/10 text-white/50",
              ].join(" ")}
            >
              Telegram
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
