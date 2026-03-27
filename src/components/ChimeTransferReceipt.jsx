import { useRef } from "react";
import { Button } from "./ui/button";
import { X, CheckCircle } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function ChimeTransferReceipt({ transaction, onClose }) {
  const receiptRef = useRef(null);

  const downloadReceipt = async () => {
    const element = receiptRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#0a3d2e'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`chime-receipt-${transaction.id}.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a3d2e] rounded-3xl max-w-md w-full max-h-[90vh] overflow-auto">
        <div className="p-8">
          <div className="flex justify-end mb-4">
            <button onClick={onClose} className="text-white/60 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div ref={receiptRef} className="bg-[#0a3d2e] p-6 text-white">
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 rounded-full bg-[#25D366] flex items-center justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-white" strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-semibold">Transfer complete</h2>
            </div>

            <div className="bg-[#0d4d3a] rounded-2xl p-6 space-y-5">
              <div className="text-center pb-5 border-b border-white/10">
                <div className="text-5xl font-bold">${transaction.amount?.toFixed(2)}</div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-white/70">From</span>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#25D366] flex items-center justify-center">
                    <span className="text-xs font-bold">C</span>
                  </div>
                  <span className="font-semibold">Checking</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-white/70">To</span>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#25D366] flex items-center justify-center">
                    <span className="text-xs font-bold">S</span>
                  </div>
                  <span className="font-semibold">{transaction.to_account}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-white/10">
                <span className="text-white/70">Frequency</span>
                <span className="font-semibold">One-time</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-white/70">Availability</span>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">⚡</span>
                  <span className="font-semibold">Instant</span>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={downloadReceipt}
            className="w-full mt-6 bg-[#25D366] hover:bg-[#20b858] text-white font-semibold py-6 rounded-full"
          >
            Download Receipt
          </Button>
        </div>
      </div>
    </div>
  );
}