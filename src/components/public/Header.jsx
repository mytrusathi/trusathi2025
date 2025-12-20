export default function Header() {
  return (
    <header className="w-full bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold">
            ❤
          </div>
          <div>
            <div className="font-semibold text-lg">Trusathi</div>
            <div className="text-xs text-gray-500">
              TRUSTED MATRIMONY NETWORK
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-medium">
            Member Login / Signup
          </button>
          <button className="px-5 py-2 rounded-full border text-sm font-medium">
            Partner / Admin Login
          </button>
        </div>

      </div>
    </header>
  );
}
