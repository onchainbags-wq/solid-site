export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6">
      <h1 className="text-5xl font-bold mb-4">$SOLID</h1>

      <p className="text-xl mb-8 text-gray-400">
        still solid.
      </p>

      <div className="bg-gray-900 rounded-xl p-4 mb-6 w-full max-w-md text-center">
        <p className="text-sm text-gray-500 mb-2">Contract Address</p>
        <code className="block break-all text-lg">
          CA_GOES_HERE
        </code>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        <a href="#" className="bg-white text-black py-3 rounded-xl text-center font-semibold">
          Buy
        </a>
        <a href="#" className="bg-white text-black py-3 rounded-xl text-center font-semibold">
          Chart
        </a>
        <a href="#" className="bg-white text-black py-3 rounded-xl text-center font-semibold">
          X
        </a>
        <a href="#" className="bg-white text-black py-3 rounded-xl text-center font-semibold">
          Telegram
        </a>
      </div>
    </main>
  );
}

