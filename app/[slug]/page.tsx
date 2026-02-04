cat > 'app/[slug]/page.tsx' <<'EOF'
import fs from "fs";
import path from "path";
import Image from "next/image";
import { notFound } from "next/navigation";

// Prefer whichever CopyButton path you actually have.
// Keep ONE of these imports and delete the other if it errors.
import CopyButton from "@/app/components/CopyButton";
// import CopyButton from "@/app/CopyButton";

type Coin = {
  name: string;
  ticker: string;
  caption?: string;
  tagline?: string;
  trustLine?: string;
  ca?: string;
  image?: string;
  links?: {
    pumpfun?: string;
    dexscreener?: string;
    x?: string;
    telegram?: string;
  };
};

function loadCoin(slug: string): Coin | null {
  const file = path.join(process.cwd(), "characters", `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  return JSON.parse(raw) as Coin;
}

function isLiveUrl(url?: string) {
  if (!url) return false;
  const u = url.trim();
  if (!u || u === "#") return false;
  return /^https?:\/\//i.test(u);
}

function ButtonLink({
  href,
  children,
  className = "",
}: {
  href?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const live = isLiveUrl(href);
  const base =
    "w-full rounded-xl px-4 py-3 text-center font-semibold transition " +
    "focus:outline-none focus:ring-2 focus:ring-white/15";
  const enabled =
    "bg-white text-black hover:opacity-90 active:opacity-80";
  const disabled =
    "bg-white/10 text-white/40 cursor-not-allowed";
  return (
    <a
      href={live ? href : undefined}
      aria-disabled={!live}
      target={live ? "_blank" : undefined}
      rel={live ? "noopener noreferrer" : undefined}
      className={`${base} ${live ? enabled : disabled} ${className}`}
    >
      {children}
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

  const caption = coin.caption?.trim() || "market dumping?";
  const ticker = coin.ticker?.trim() || "$SOLID";
  const tagline = coin.tagline?.trim() || "still solid.";
  const trustLine = coin.trustLine?.trim() || "Powered by ChainDeployer Automate";
  const ca = coin.ca?.trim() || "CA_GOES_HERE";

  const pump = coin.links?.pumpfun || "#";
  const dex = coin.links?.dexscreener || "#";
  const x = coin.links?.x || "#";
  const tg = coin.links?.telegram || "#";

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(800px_500px_at_50%_20%,rgba(34,211,238,0.18),transparent_55%),radial-gradient(700px_500px_at_70%_10%,rgba(168,85,247,0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 py-16">
        {/* Hero */}
        <div className="relative mb-8 flex flex-col items-center">
          <div className="relative">
            {/* Glow behind hero */}
            <div className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.22),transparent_60%)] blur-2xl" />
            <div className="animate-[float_4s_ease-in-out_infinite]">
              <Image
                src={coin.image || "/images/solid.png"}
                alt={coin.name || "SOLID"}
                width={520}
                height={520}
                priority
                className="h-auto w-[280px] sm:w-[340px] drop-shadow-[0_25px_35px_rgba(0,0,0,0.65)]"
              />
            </div>
          </div>

          {/* Copy */}
          <div className="mt-6 text-center">
            <div className="text-xs tracking-wide text-white/50">{caption}</div>
            <div className="mt-2 text-5xl font-extrabold tracking-tight">{ticker}</div>
            <div className="mt-1 text-lg text-white/70">{tagline}</div>
          </div>
        </div>

        {/* CA box */}
        <div className="w-full rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
          <div className="mb-2 text-center text-xs text-white/45">Contract Address</div>
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3">
            <div className="min-w-0 flex-1">
              <div className="text-[11px] text-white/40">Tap to copy</div>
              <div className="truncate font-mono text-sm text-white/85">{ca}</div>
            </div>
            <CopyButton value={ca} />
          </div>
        </div>

        {/* BUY + trust nudge */}
        <div className="mt-5 w-full">
          <ButtonLink
            href={pump}
            className="bg-emerald-400 text-black hover:opacity-95"
          >
            Buy on pump.fun
          </ButtonLink>
          <div className="mt-2 text-center text-xs text-white/45">
            {trustLine}
          </div>
        </div>

        {/* Secondary buttons */}
        <div className="mt-5 grid w-full grid-cols-2 gap-3">
          <ButtonLink href={dex}>DexScreener</ButtonLink>
          <ButtonLink href={x}>X</ButtonLink>
          <div className="col-span-2">
            <ButtonLink href={tg}>Telegram</ButtonLink>
          </div>
        </div>

        {/* Small footer */}
        <div className="mt-8 text-center text-xs text-white/35">
          Powered by ChainDeployer Automate
        </div>
      </div>

      {/* Pure Tailwind keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </main>
  );
}
EOF

