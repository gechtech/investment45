import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Wallet, 
  TrendingUp, 
  Users, 
  Target, 
  ArrowRight,
  Copy,
  CheckCircle
} from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [investments, setInvestments] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [teamStats, setTeamStats] = useState({ total: 0, level1: 0, level2: 0, level3: 0 });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [investmentsRes, tasksRes, teamRes] = await Promise.all([
        axios.get('/api/investments/user'),
        axios.get('/api/tasks/user'),
        axios.get('/api/referrals/team')
      ]);

      setInvestments(investmentsRes.data.investments || []);
      setTasks(tasksRes.data || []);
      setTeamStats(teamRes.data.team || { total: 0, level1: 0, level2: 0, level3: 0 });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    const referralLink = `${window.location.origin}/register?ref=${user?.referralCode}`;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const completedTasks = tasks.filter(task => task.isCompleted).length;
  const totalTasks = tasks.length;
  const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const activeInvestments = investments.filter(inv => inv.isActive);
  const totalInvestmentAmount = activeInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalDailyProfit = activeInvestments.reduce((sum, inv) => sum + inv.dailyProfit, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.fullName}!</h1>
        <p className="text-yellow-100">Here's your investment overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Wallet Balance</p>
              <p className="text-2xl font-bold text-gray-900">
                {user?.walletBalance?.toLocaleString()} ETB
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Wallet className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">
                {user?.totalEarnings?.toLocaleString()} ETB
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Team Members</p>
              <p className="text-2xl font-bold text-gray-900">{teamStats.total}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Task Progress</p>
              <p className="text-2xl font-bold text-gray-900">{taskProgress.toFixed(0)}%</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Target className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Referral Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Referral Code</h2>
        <div className="flex items-center space-x-4">
          <div className="flex-1 bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Your Referral Code</p>
            <p className="text-2xl font-bold text-gray-900">{user?.referralCode}</p>
          </div>
          <button
            onClick={copyReferralLink}
            className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300"
          >
            {copied ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/invest"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Start Investing</h3>
              <p className="text-sm text-gray-600">Choose your investment plan</p>
            </div>
            <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-orange-500 transition-colors" />
          </div>
        </Link>

        <Link
          to="/tasks"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Complete Tasks</h3>
              <p className="text-sm text-gray-600">Earn bonus rewards</p>
            </div>
            <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-orange-500 transition-colors" />
          </div>
        </Link>

        <Link
          to="/team"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">My Team</h3>
              <p className="text-sm text-gray-600">View referral network</p>
            </div>
            <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-orange-500 transition-colors" />
          </div>
        </Link>
      </div>

      {/* Recent Investments */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Active Investments</h2>
          <Link
            to="/invest"
            className="text-orange-600 hover:text-orange-500 font-medium"
          >
            View All
          </Link>
        </div>
        
        {activeInvestments.length > 0 ? (
          <div className="space-y-4">
            {activeInvestments.slice(0, 3).map((investment) => (
              <div key={investment._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900">Plan {investment.planId.toUpperCase()}</h3>
                    <p className="text-sm text-gray-600">
                      {investment.amount.toLocaleString()} ETB • Day {investment.daysPaid}/{investment.maxDays}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">
                      +{investment.dailyProfit.toLocaleString()} ETB/day
                    </p>
                    <p className="text-xs text-gray-500">
                      Total: {investment.totalProfit.toLocaleString()} ETB
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No active investments yet</p>
            <Link
              to="/invest"
              className="mt-4 inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300"
            >
              <span>Start Investing</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;