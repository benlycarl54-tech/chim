export default function WelcomeBanner({ userName }) {
  return (
    <div className="bg-white mx-5 my-4 rounded-2xl p-5 border border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-3xl">📦</div>
        <h3 className="text-lg font-bold text-gray-900">Your card was delivered</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">Arrived on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
      <button className="w-full bg-[#25D366] hover:bg-[#20b858] text-white font-semibold py-3 rounded-full transition-colors">
        Activate
      </button>
    </div>
  );
}