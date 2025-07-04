import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ArrowDownToLine, Banknote, AlertCircle } from 'lucide-react';

const WithdrawPage = () => {
  const [amount, setAmount] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [accountName, setAccountName] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const withdrawAmount = parseFloat(amount);
    const minWithdraw = 1000; // Minimum withdrawal amount
    
    if (withdrawAmount < minWithdraw) {
      showToast(`Minimum withdrawal amount is ${minWithdraw} ETB`, 'error');
      return;
    }
    
    if (withdrawAmount > (user?.walletBalance || 0)) {
      showToast('Insufficient balance', 'error');
      return;
    }

    setLoading(true);

    try {
      // Here you would typically make an API call to process the withdrawal
      // For now, we'll just show a success message
      showToast('Withdrawal request submitted successfully!', 'success');
      
      // Reset form
      setAmount('');
      setBankAccount('');
      setAccountName('');
    } catch (error) {
      showToast('Failed to process withdrawal request', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-red-100 p-2 rounded-full">
            <ArrowDownToLine className="w-6 h-6 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Withdraw Funds</h1>
        </div>

        {/* Current Balance */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available Balance</p>
              <p className="text-3xl font-bold text-gray-900">
                {user?.walletBalance?.toLocaleString() || 0} ETB
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Banknote className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Withdrawal Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Withdrawal Amount (ETB)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter amount to withdraw"
              min="1000"
              max={user?.walletBalance || 0}
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Minimum withdrawal: 1,000 ETB
            </p>
          </div>

          <div>
            <label htmlFor="bankAccount" className="block text-sm font-medium text-gray-700 mb-2">
              Bank Account Number
            </label>
            <input
              type="text"
              id="bankAccount"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter your bank account number"
              required
            />
          </div>

          <div>
            <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-2">
              Account Holder Name
            </label>
            <input
              type="text"
              id="accountName"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter account holder name"
              required
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Withdrawal Information</h3>
                <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                  <li>• Processing time: 1-3 business days</li>
                  <li>• Withdrawal fee: 2% of amount</li>
                  <li>• Bank transfers are processed during business hours</li>
                  <li>• Ensure account details are correct to avoid delays</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !amount || !bankAccount || !accountName}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {loading ? 'Processing...' : 'Submit Withdrawal Request'}
          </button>
        </form>
      </div>

      {/* Recent Withdrawals */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Withdrawals</h2>
        
        <div className="text-center py-8">
          <ArrowDownToLine className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No withdrawal history yet</p>
        </div>
      </div>
    </div>
  );
};

export default WithdrawPage;