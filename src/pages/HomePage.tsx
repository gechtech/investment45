import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Users, Shield, Award } from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: TrendingUp,
      title: '20% Daily ROI',
      description: 'Earn 20% daily returns on your investment for 65 days'
    },
    {
      icon: Users,
      title: '3-Level Referrals',
      description: 'Build your network and earn commissions up to 3 levels deep'
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Bank-grade security with Ethiopian bank integration'
    },
    {
      icon: Award,
      title: 'Proven Track Record',
      description: 'Join thousands of successful investors in Ethiopia'
    }
  ];

  const investmentPlans = [
    { name: 'V1', amount: '500 ETB', daily: '100 ETB', total: '6,500 ETB' },
    { name: 'V5', amount: '4,000 ETB', daily: '800 ETB', total: '52,000 ETB' },
    { name: 'V10', amount: '200,000 ETB', daily: '40,000 ETB', total: '2,600,000 ETB' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              EthioInvest
              <span className="block text-3xl sm:text-5xl bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                Network
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Ethiopia's premier investment platform offering 20% daily returns for 65 days. 
              Join thousands of successful investors and build your financial future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-2"
              >
                <span>Start Investing</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="bg-white text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border border-gray-200"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose EthioInvest?</h2>
            <p className="text-xl text-gray-600">Built for Ethiopian investors, by Ethiopian experts</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Investment Plans */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Investment Plans</h2>
            <p className="text-xl text-gray-600">Choose the plan that fits your investment goals</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {investmentPlans.map((plan, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-8 transform hover:scale-105 transition-transform duration-300">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Plan {plan.name}</h3>
                  <div className="text-3xl font-bold text-yellow-600 mb-4">{plan.amount}</div>
                  <div className="space-y-2 text-gray-600">
                    <p>Daily Return: <span className="font-semibold text-green-600">{plan.daily}</span></p>
                    <p>Total Return: <span className="font-semibold text-green-600">{plan.total}</span></p>
                    <p>Duration: <span className="font-semibold">65 Days</span></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/register"
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center space-x-2"
            >
              <span>View All Plans</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-yellow-400 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Investment Journey?</h2>
          <p className="text-xl text-white/90 mb-8">Join thousands of successful investors in Ethiopia</p>
          <Link
            to="/register"
            className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center space-x-2"
          >
            <span>Get Started Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;