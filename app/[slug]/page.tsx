import fs from "fs";
import path from "path";
import Image from "next/image";

import CopyButton from "@/app/components/CopyButton";

type Character = {
  name: string;
  ticker: string;
  caption?: string;
  tagline: string;
  trustLine?: string;
  ca?: string;
  image: string;
  links: {
    pumpfun?: string;
    dexscreener?: string;
    x?: string;
    telegram?: string;
  };
};

export default function Page({ params }: { params: { slug: string } }) {
  const filePath = path.join(process.cwd(), "characters", `${params.slug}.json`);
  const c: Character = JSON.parse(fs.readFileSync(filePath, "utf8"));

  return (
    <main className="min-h-screen flex flex-col items-center justify-start pt-20 px-4 text-white bg-black">
      {/* IMAGE */}
      <div className="mb-6">
        <Image
          src={c.image}
          alt={c.name}
          width={220}
          height={220}
          priority
        />
      </div>

      {/* TITLE */}
      {c.caption && (
        <div className="text-[13px] text-white/40 mb-1">
          {c.caption}
        </div>
      )}

      <h1 className="text-4xl font-bold mb-1">{c.ticker}</h1>
      <div className="text-white/50 mb-8">{c.tagline}</div>

      {/* CA CARD */}
      {c.ca && (
        <div className="w-full max-w-md rounded-xl bg-[#0b1220] p-5 mb-6">
          <div className="text-[12px] text-white/40 mb-2 text-center">
            Contract Address
          </div>

          <div className="flex items-center gap-2 bg-[#141c2f] rounded-lg px-3 py-2">
            <div className="flex-1 text-sm truncate">
              {c.ca}
            </div>

            {/* IMPORTANT FIX: wrap CopyButton */}
            <div>
              <CopyButton text={c.ca} />
            </div>
          </div>

          <div className="text-[11px] text-center text-white/30 mt-2">
            Verify CA in Telegram pinned
          </div>
        </div>
      )}

      {/* BUY BUTTON */}
      <div className="w-full max-w-md mb-4">
        <div className="w-full rounded-lg bg-white/10 text-center py-3 text-white/60 text-sm">
          Buy (link goes live at launch)
        </div>
        <div className="text-[11px] text-center text-white/30 mt-1">
          Powered by ChainDeployer Automate
        </div>
      </div>

      {/* LINKS */}
      <div className="w-full max-w-md grid grid-cols-2 gap-3 mt-4">
        <a
          href={c.links.dexscreener || "#"}
          className="rounded-lg bg-white/10 py-3 text-center text-sm hover:bg-white/20 transition"
        >
          DexScreener
        </a>

        <a
          href={c.links.x || "#"}
          className="rounded-lg bg-white text-black py-3 text-center text-sm font-medium hover:bg-white/90 transition"
        >
          X
        </a>

        <a
          href={c.links.telegram || "#"}
          className="col-span-2 rounded-lg bg-white py-3 text-center text-sm font-medium text-black hover:bg-white/90 transition"
        >
          Telegram
        </a>
      </div>
    </main>
  );
}
