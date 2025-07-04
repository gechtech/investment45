import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { TrendingUp, Upload, FileImage } from 'lucide-react';
import axios from 'axios';

const InvestmentPage = () => {
  const [selectedPlan, setSelectedPlan] = useState('');
  const [ftId, setFtId] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const { showToast } = useToast();

  const investmentPlans = [
    { id: 'v1', name: 'V1', amount: 500, dailyProfit: 100, totalProfit: 6500 },
    { id: 'v2', name: 'V2', amount: 1000, dailyProfit: 200, totalProfit: 13000 },
    { id: 'v3', name: 'V3', amount: 1500, dailyProfit: 300, totalProfit: 19500 },
    { id: 'v4', name: 'V4', amount: 2500, dailyProfit: 500, totalProfit: 32500 },
    { id: 'v5', name: 'V5', amount: 4000, dailyProfit: 800, totalProfit: 52000 },
    { id: 'v6', name: 'V6', amount: 8000, dailyProfit: 1600, totalProfit: 104000 },
    { id: 'v7', name: 'V7', amount: 15000, dailyProfit: 3000, totalProfit: 195000 },
    { id: 'v8', name: 'V8', amount: 50000, dailyProfit: 10000, totalProfit: 650000 },
    { id: 'v9', name: 'V9', amount: 100000, dailyProfit: 20000, totalProfit: 1300000 },
    { id: 'v10', name: 'V10', amount: 200000, dailyProfit: 40000, totalProfit: 2600000 },
  ];

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get('/api/investments/user');
      setSubmissions(response.data.submissions || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('File size must be less than 2MB', 'error');
        return;
      }
      
      if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
        showToast('Only JPG and PNG files are allowed', 'error');
        return;
      }

      setScreenshot(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setScreenshotPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlan || !ftId || !screenshot) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    setLoading(true);

    try {
      // Upload screenshot first
      const formData = new FormData();
      formData.append('screenshot', screenshot);
      
      const uploadResponse = await axios.post('/api/upload/screenshot', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Submit investment
      const investmentData = {
        planId: selectedPlan,
        ftId,
        screenshotUrl: uploadResponse.data.url,
      };

      await axios.post('/api/investments/submit', investmentData);
      
      showToast('Investment submitted successfully!', 'success');
      
      // Reset form
      setSelectedPlan('');
      setFtId('');
      setScreenshot(null);
      setScreenshotPreview('');
      
      // Refresh submissions
      fetchSubmissions();
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Submission failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Investment Plans</h1>
        
        {/* Investment Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {investmentPlans.map((plan) => (
            <div
              key={plan.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedPlan === plan.id
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                <div className="text-2xl font-bold text-orange-600 my-2">
                  {plan.amount.toLocaleString()} ETB
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Daily: <span className="font-semibold text-green-600">{plan.dailyProfit.toLocaleString()} ETB</span></p>
                  <p>Total: <span className="font-semibold text-green-600">{plan.totalProfit.toLocaleString()} ETB</span></p>
                  <p>Duration: <span className="font-semibold">65 Days</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Investment Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Transfer Instructions
            </label>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Transfer Details:</h4>
              <div className="space-y-1 text-sm text-blue-800">
                <p><strong>Bank:</strong> Commercial Bank of Ethiopia</p>
                <p><strong>Account Number:</strong> 1000123456789</p>
                <p><strong>Account Name:</strong> EthioInvest Network</p>
                <p><strong>Amount:</strong> {selectedPlan ? investmentPlans.find(p => p.id === selectedPlan)?.amount.toLocaleString() : 0} ETB</p>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="ftId" className="block text-sm font-medium text-gray-700 mb-2">
              FT ID (Transaction Reference)
            </label>
            <input
              type="text"
              id="ftId"
              value={ftId}
              onChange={(e) => setFtId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter your FT ID"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Screenshot
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              {screenshotPreview ? (
                <div className="space-y-4">
                  <img
                    src={screenshotPreview}
                    alt="Screenshot preview"
                    className="max-w-full h-64 object-contain mx-auto rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setScreenshot(null);
                      setScreenshotPreview('');
                    }}
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Upload payment screenshot</p>
                  <p className="text-sm text-gray-500">JPG, PNG files only (max 2MB)</p>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="mt-4"
                    required
                  />
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !selectedPlan || !ftId || !screenshot}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {loading ? 'Submitting...' : 'Submit Investment'}
          </button>
        </form>
      </div>

      {/* Submission History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Submission History</h2>
        
        {submissions.length > 0 ? (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div key={submission._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Plan {submission.planId.toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Amount: {submission.amount.toLocaleString()} ETB
                    </p>
                    <p className="text-sm text-gray-600">
                      FT ID: {submission.ftId}
                    </p>
                    <p className="text-sm text-gray-600">
                      Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(submission.status)}`}>
                    {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                  </span>
                </div>
                {submission.rejectionReason && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">
                      <strong>Rejection Reason:</strong> {submission.rejectionReason}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No submissions yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentPage;