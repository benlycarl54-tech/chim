import { useRef } from "react";
import { Button } from "./ui/button";
import { X, CheckCircle } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function ZelleTransferReceipt({ transaction, onClose }) {
  const receiptRef = useRef(null);

  const downloadReceipt = async () => {
    const element = receiptRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff'
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
    pdf.save(`zelle-receipt-${transaction.id}.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-auto">
        <div className="p-8">
          <div className="flex justify-end mb-4">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div ref={receiptRef} className="bg-white p-6">
            <div className="flex flex-col items-start mb-8">
              <div className="w-16 h-16 rounded-full border-4 border-[#25D366] flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-[#25D366]" strokeWidth={2.5} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">${transaction.amount?.toFixed(2)} sent</h2>
              <p className="text-gray-600">
                You paid {transaction.to_account} for:
              </p>
              <p className="text-lg">{transaction.reference || "💰"}</p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">
                We just notified your friend. If they don't accept the money in 14 days, we'll refund you.
              </p>
              <p className="text-sm text-gray-500">
                If your friend signs up for Chime and receives a qualifying direct deposit of $200+ within their first 45 days, you'll both get $100.
              </p>
            </div>
          </div>

          <Button
            onClick={downloadReceipt}
            className="w-full mt-6 bg-[#25D366] hover:bg-[#20b858] text-white font-semibold py-6 rounded-full"
          >
            Got it
          </Button>
        </div>
      </div>
    </div>
  );
}