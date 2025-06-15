import React, { useState } from 'react';
import { Download, Eye, Star, Users, Calendar } from 'lucide-react';
import { PaymentModal } from './PaymentModal';

interface Dataset {
  id: string;
  title: string;
  description: string;
  creator: string;
  price: number;
  downloads: number;
  rating: number;
  size: string;
  format: string;
  category: string;
  uploadDate: string;
  tags: string[];
}

interface DatasetCardProps {
  dataset: Dataset;
}

export const DatasetCard: React.FC<DatasetCardProps> = ({ dataset }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{dataset.title}</h3>
              <p className="text-sm text-gray-600">by {dataset.creator}</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-teal-600">{dataset.price} SOL</div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{dataset.rating}</span>
              </div>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{dataset.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {dataset.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {dataset.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                +{dataset.tags.length - 3} more
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{dataset.downloads.toLocaleString()} downloads</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{dataset.uploadDate}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Purchase
            </button>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        dataset={dataset}
      />
    </>
  );
};