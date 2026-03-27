import { ChevronRight, MoreVertical } from "lucide-react";

export default function AccountCard({ logo, logoType, accountName, sortCode, accountNumber, balance, isNegative }) {
  const formattedBalance = Math.abs(balance).toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const [whole, decimal] = formattedBalance.split('.');

  return (
    <div className="bg-white rounded-2xl mx-5 mb-3 p-4 shadow-[0_1px_4px_rgba(0,0,0,0.08)] border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden mt-0.5">
            {logoType === "lloyds" && (
              <div className="w-full h-full bg-white flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-9 h-9">
                  <path d="M20 5 C15 10, 8 15, 8 22 C8 28, 13 33, 20 33 C27 33, 32 28, 32 22 C32 15, 25 10, 20 5Z" fill="none" stroke="#000" strokeWidth="1.5"/>
                  <path d="M12 20 Q16 16, 20 20 Q24 24, 28 20" fill="none" stroke="#000" strokeWidth="1.5"/>
                  <path d="M14 24 Q18 20, 22 24 Q26 28, 30 24" fill="none" stroke="#000" strokeWidth="1.2"/>
                </svg>
              </div>
            )}
            {logoType === "halifax" && (
              <div className="w-full h-full bg-white flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-8 h-8">
                  <line x1="12" y1="12" x2="28" y2="28" stroke="#003087" strokeWidth="3"/>
                  <line x1="28" y1="12" x2="12" y2="28" stroke="#003087" strokeWidth="3"/>
                  <line x1="20" y1="8" x2="20" y2="32" stroke="#003087" strokeWidth="3"/>
                  <line x1="8" y1="20" x2="32" y2="20" stroke="#003087" strokeWidth="3"/>
                </svg>
              </div>
            )}
            {logoType === "mbna" && (
              <div className="w-full h-full bg-[#1a2744] rounded-lg flex items-center justify-center">
                <span className="text-white text-[10px] font-bold tracking-wide">mbna</span>
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[#003087] font-bold text-sm">{accountName}</span>
              <ChevronRight className="w-4 h-4 text-[#003087]" />
            </div>
            <p className="text-gray-500 text-xs mt-0.5 tracking-wide">{sortCode}  {accountNumber}</p>
          </div>
        </div>
        <button className="p-1 -mr-1 -mt-0.5">
          <MoreVertical className="w-5 h-5 text-[#003087]" />
        </button>
      </div>
      <div className="mt-3 pl-[52px]">
        <span className={`text-2xl font-bold ${isNegative ? 'text-gray-900' : 'text-gray-900'}`}>
          {isNegative ? '-' : ''}£{whole}
          <span className="text-lg font-semibold text-gray-500">.{decimal}</span>
        </span>
      </div>
    </div>
  );
}