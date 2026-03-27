import { Search, Mic } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="bg-white px-5 py-4">
      <div className="bg-gray-100 rounded-full flex items-center px-4 py-3">
        <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
        <span className="text-gray-400 text-sm flex-1">What can we help you with?</span>
        <Mic className="w-5 h-5 text-gray-400 flex-shrink-0" />
      </div>
    </div>
  );
}