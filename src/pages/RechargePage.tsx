import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { CreditCard, Copy, CheckCircle, Info } from 'lucide-react';

const RechargePage = () => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const bankDetails = {
    bankName: 'Commercial Bank of Ethiopia',
    accountNumber: '1000123456789',
    accountName: 'EthioInvest Network',
    swiftCode: 'CBETETAA'
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast(`${label} copied to clipboard`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-green-100 p-2 rounded-full">
            <CreditCard className="w-6 h-6 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Recharge Account</h1>
        </div>

        {/* Bank Details */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Bank Transfer Details</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Bank Name</p>
                <p className="text-lg font-semibold text-gray-900">{bankDetails.bankName}</p>
              </div>
              <button
                onClick={() => copyToClipboard(bankDetails.bankName, 'Bank name')}
                className="text-orange-600 hover:text-orange-700"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Account Number</p>
                <p className="text-lg font-semibold text-gray-900">{bankDetails.accountNumber}</p>
              </div>
              <button
                onClick={() => copyToClipboard(bankDetails.accountNumber, 'Account number')}
                className="text-orange-600 hover:text-orange-700"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Account Name</p>
                <p className="text-lg font-semibold text-gray-900">{bankDetails.accountName}</p>
              </div>
              <button
                onClick={() => copyToClipboard(bankDetails.accountName, 'Account name')}
                className="text-orange-600 hover:text-orange-700"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">SWIFT Code</p>
                <p className="text-lg font-semibold text-gray-900">{bankDetails.swiftCode}</p>
              </div>
              <button
                onClick={() => copyToClipboard(bankDetails.swiftCode, 'SWIFT code')}
                className="text-orange-600 hover:text-orange-700"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-800 mb-2">How to Recharge</h3>
              <ol className="text-sm text-blue-700 space-y-2">
                <li>1. Transfer funds to the account details above</li>
                <li>2. Save the FT ID (transaction reference)</li>
                <li>3. Take a screenshot of the transfer confirmation</li>
                <li>4. Go to the Investment page to submit your investment</li>
                <li>5. Upload the screenshot and enter your FT ID</li>
                <li>6. Wait for admin approval to start earning</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Investment Plans Quick Reference */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Plans Quick Reference</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">V1:</span>
                <span className="text-sm">500 ETB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">V2:</span>
                <span className="text-sm">1,000 ETB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">V3:</span>
                <span className="text-sm">1,500 ETB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">V4:</span>
                <span className="text-sm">2,500 ETB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">V5:</span>
                <span className="text-sm">4,000 ETB</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">V6:</span>
                <span className="text-sm">8,000 ETB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">V7:</span>
                <span className="text-sm">15,000 ETB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">V8:</span>
                <span className="text-sm">50,000 ETB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">V9:</span>
                <span className="text-sm">100,000 ETB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">V10:</span>
                <span className="text-sm">200,000 ETB</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <a
            href="/invest"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all duration-300"
          >
            <span>Go to Investment Page</span>
            <CreditCard className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default RechargePage;