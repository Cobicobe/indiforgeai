import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Download, Eye, Plus } from 'lucide-react';
import { useDatasetMarketplace } from '../hooks/useDatasetMarketplace';

export const CreatorDashboard: React.FC = () => {
  const { getCreatorEarnings, createDatasetListing, isProcessing } = useDatasetMarketplace();
  const [earnings, setEarnings] = useState({ totalEarnings: 0, datasets: [] });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    royaltyPercentage: '7.5',
    description: '',
    category: '',
    tags: '',
  });

  useEffect(() => {
    loadEarnings();
  }, []);

  const loadEarnings = async () => {
    const data = await getCreatorEarnings();
    setEarnings(data);
  };

  const handleCreateDataset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await createDatasetListing({
      title: formData.title,
      price: parseFloat(formData.price),
      royaltyPercentage: parseFloat(formData.royaltyPercentage),
      metadataUri: `https://api.indiforge.ai/metadata/${Date.now()}`, // Mock metadata URI
    });

    if (result.success) {
      setShowCreateForm(false);
      setFormData({
        title: '',
        price: '',
        royaltyPercentage: '7.5',
        description: '',
        category: '',
        tags: '',
      });
      loadEarnings();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Creator Dashboard</h1>
          <p className="text-gray-600">Manage your datasets and track your earnings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-teal-600">
                  {earnings.totalEarnings.toFixed(4)} SOL
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-teal-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Datasets</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <Eye className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Downloads</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
              </div>
              <Download className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Royalty</p>
                <p className="text-2xl font-bold text-gray-900">7.5%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Create Dataset Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create New Dataset
          </button>
        </div>

        {/* Create Dataset Form */}
        {showCreateForm && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
            <h3 className="text-lg font-semibold mb-4">Create New Dataset</h3>
            <form onSubmit={handleCreateDataset} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dataset Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (SOL)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Royalty Percentage (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="50"
                  value={formData.royaltyPercentage}
                  onChange={(e) => setFormData({ ...formData, royaltyPercentage: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Percentage you'll earn from each sale (recommended: 5-10%)
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Creating...' : 'Create Dataset'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Recent Earnings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Recent Earnings</h3>
          </div>
          <div className="p-6">
            {earnings.datasets.length > 0 ? (
              <div className="space-y-4">
                {earnings.datasets.slice(0, 10).map((purchase: any, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="font-medium">Dataset Purchase</p>
                      <p className="text-sm text-gray-600">
                        {new Date(purchase.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-teal-600">
                        +{purchase.royaltyDistribution?.creatorAmount?.toFixed(4) || '0.0000'} SOL
                      </p>
                      <p className="text-sm text-gray-600">Royalty</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No earnings yet. Create your first dataset to start earning!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};