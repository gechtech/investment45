import React, { useState, useEffect } from 'react';
import { Users, Award, TrendingUp } from 'lucide-react';
import axios from 'axios';

const TeamPage = () => {
  const [teamData, setTeamData] = useState({
    team: { level1: 0, level2: 0, level3: 0, total: 0 },
    members: { level1: [], level2: [], level3: [] },
    earnings: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      const response = await axios.get('/api/referrals/team');
      setTeamData(response.data);
    } catch (error) {
      console.error('Error fetching team data:', error);
    } finally {
      setLoading(false);
    }
  };

  const levelColors = {
    1: 'bg-green-100 text-green-800',
    2: 'bg-blue-100 text-blue-800',
    3: 'bg-purple-100 text-purple-800'
  };

  const totalEarnings = teamData.earnings.reduce((sum, earning) => sum + earning.commissionAmount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Team</h1>
        
        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Level 1</p>
                <p className="text-3xl font-bold">{teamData.team.level1}</p>
              </div>
              <Users className="w-8 h-8 text-green-100" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Level 2</p>
                <p className="text-3xl font-bold">{teamData.team.level2}</p>
              </div>
              <Users className="w-8 h-8 text-blue-100" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Level 3</p>
                <p className="text-3xl font-bold">{teamData.team.level3}</p>
              </div>
              <Users className="w-8 h-8 text-purple-100" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100">Total Members</p>
                <p className="text-3xl font-bold">{teamData.team.total}</p>
              </div>
              <Award className="w-8 h-8 text-yellow-100" />
            </div>
          </div>
        </div>

        {/* Commission Structure */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Commission Structure</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="bg-green-100 text-green-800 rounded-full px-4 py-2 inline-block mb-2">
                Level 1
              </div>
              <p className="text-2xl font-bold text-green-600">10%</p>
              <p className="text-sm text-gray-600">Direct referrals</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 text-blue-800 rounded-full px-4 py-2 inline-block mb-2">
                Level 2
              </div>
              <p className="text-2xl font-bold text-blue-600">5%</p>
              <p className="text-sm text-gray-600">Second level</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 text-purple-800 rounded-full px-4 py-2 inline-block mb-2">
                Level 3
              </div>
              <p className="text-2xl font-bold text-purple-600">2%</p>
              <p className="text-sm text-gray-600">Third level</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Team Members</h2>
        
        {teamData.team.total > 0 ? (
          <div className="space-y-6">
            {[1, 2, 3].map((level) => {
              const members = teamData.members[`level${level}`] || [];
              if (members.length === 0) return null;

              return (
                <div key={level}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Level {level} ({members.length} members)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {members.map((member) => (
                      <div key={member._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900">{member.fullName}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${levelColors[level]}`}>
                            L{level}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{member.email}</p>
                        <div className="mt-2 text-sm">
                          <p className="text-gray-600">
                            Balance: <span className="font-medium">{member.walletBalance.toLocaleString()} ETB</span>
                          </p>
                          <p className="text-gray-600">
                            Joined: {new Date(member.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No team members yet</p>
            <p className="text-sm text-gray-400">Share your referral link to start building your team</p>
          </div>
        )}
      </div>

      {/* Earnings History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Referral Earnings</h2>
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
            <span className="font-semibold">{totalEarnings.toLocaleString()} ETB</span>
          </div>
        </div>
        
        {teamData.earnings.length > 0 ? (
          <div className="space-y-4">
            {teamData.earnings.map((earning) => (
              <div key={earning._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {earning.referredId.fullName}
                    </h4>
                    <p className="text-sm text-gray-600">{earning.referredId.email}</p>
                    <p className="text-sm text-gray-600">
                      Level {earning.level} Commission
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      +{earning.commissionAmount.toLocaleString()} ETB
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(earning.paidAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No earnings yet</p>
            <p className="text-sm text-gray-400">You'll see earnings when your team members make investments</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamPage;