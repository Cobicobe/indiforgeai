import React from 'react';
import { DollarSign, Users, Building, Gift } from 'lucide-react';
import { RoyaltyDistribution } from '../contracts/DatasetMarketplace';

interface RoyaltyBreakdownProps {
  distribution: RoyaltyDistribution;
  showTitle?: boolean;
}

export const RoyaltyBreakdown: React.FC<RoyaltyBreakdownProps> = ({ 
  distribution, 
  showTitle = true 
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      {showTitle && (
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          Royalty Distribution
        </h4>
      )}
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>Creator ({distribution.breakdown.creatorPercentage}%)</span>
          </div>
          <span className="font-medium">{distribution.creatorAmount.toFixed(4)} SOL</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Building className="w-4 h-4" />
            <span>Platform ({distribution.breakdown.platformPercentage}%)</span>
          </div>
          <span className="font-medium">{distribution.platformAmount.toFixed(4)} SOL</span>
        </div>
        
        {distribution.referralAmount > 0 && (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Gift className="w-4 h-4" />
              <span>Referral ({distribution.breakdown.referralPercentage}%)</span>
            </div>
            <span className="font-medium">{distribution.referralAmount.toFixed(4)} SOL</span>
          </div>
        )}
        
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between items-center font-semibold">
            <span>Total</span>
            <span className="text-teal-600">{distribution.totalPrice.toFixed(4)} SOL</span>
          </div>
        </div>
      </div>
    </div>
  );
};