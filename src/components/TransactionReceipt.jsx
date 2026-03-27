import { useRef } from "react";
import HalifaxLogo from "./dashboard/HalifaxLogo";
import { Button } from "./ui/button";
import { Download, X } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function TransactionReceipt({ transaction, onClose }) {
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
    pdf.save(`receipt-${transaction.id}.pdf`);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#003087]">Transaction Receipt</h2>
            <button onClick={onClose}>
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <div ref={receiptRef} className="bg-white p-6">
            <div className="flex justify-center mb-6">
              <HalifaxLogo className="w-40" />
            </div>

            <div className="border-t-2 border-b-2 border-[#1e2875] py-4 mb-4">
              <h3 className="text-center text-lg font-bold text-[#1e2875]">
                TRANSACTION RECEIPT
              </h3>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Transaction Type:</span>
                <span className="font-semibold">{transaction.transaction_type}</span>
              </div>

              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Amount:</span>
                <span className="font-bold text-[#1e2875] text-lg">£{transaction.amount?.toFixed(2)}</span>
              </div>

              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">From Account:</span>
                <span className="font-semibold">{transaction.from_account}</span>
              </div>

              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">To:</span>
                <span className="font-semibold">{transaction.to_account}</span>
              </div>

              {transaction.reference && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Reference:</span>
                  <span className="font-semibold">{transaction.reference}</span>
                </div>
              )}

              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Status:</span>
                <span className={`font-semibold ${transaction.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {transaction.status?.toUpperCase()}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Date & Time:</span>
                <span className="font-semibold">{formatDate(transaction.created_date)}</span>
              </div>

              <div className="flex justify-between py-2">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono text-xs">{transaction.id}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t text-center text-xs text-gray-500">
              <p>This is an electronic receipt.</p>
              <p>For inquiries, please contact customer support.</p>
            </div>
          </div>

          <Button
            onClick={downloadReceipt}
            className="w-full mt-4 bg-[#003087] hover:bg-[#002266]"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
}