import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { DatasetMarketplaceContract, DatasetListing, RoyaltyDistribution } from '../contracts/DatasetMarketplace';

export const useDatasetMarketplace = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();
  const [isProcessing, setIsProcessing] = useState(false);
  const [contract] = useState(() => new DatasetMarketplaceContract(connection));

  const purchaseDatasetWithRoyalties = async (
    dataset: DatasetListing,
    referrerWallet?: string
  ) => {
    if (!connected || !publicKey) {
      toast.error('Please connect your wallet first');
      return { success: false };
    }

    setIsProcessing(true);
    
    try {
      const referrer = referrerWallet ? new PublicKey(referrerWallet) : undefined;
      
      // Get transaction with royalty distribution
      const { transaction, royaltyDistribution } = await contract.purchaseDataset(
        publicKey,
        dataset.id,
        dataset,
        referrer
      );

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Send transaction
      const signature = await sendTransaction(transaction, connection);
      
      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed');
      
      // Show detailed success message with royalty breakdown
      showRoyaltyBreakdown(royaltyDistribution);
      
      // Record the purchase
      await recordPurchaseWithRoyalties({
        signature,
        datasetId: dataset.id,
        buyerWallet: publicKey.toString(),
        royaltyDistribution,
        timestamp: new Date().toISOString(),
      });

      return { success: true, signature, royaltyDistribution };
    } catch (error) {
      console.error('Purchase failed:', error);
      toast.error('Purchase failed. Please try again.');
      return { success: false, error };
    } finally {
      setIsProcessing(false);
    }
  };

  const createDatasetListing = async (
    datasetData: {
      title: string;
      price: number;
      royaltyPercentage: number;
      metadataUri: string;
    }
  ) => {
    if (!connected || !publicKey) {
      toast.error('Please connect your wallet first');
      return { success: false };
    }

    setIsProcessing(true);
    
    try {
      const datasetId = await contract.createDatasetListing(publicKey, datasetData);
      
      toast.success('Dataset listed successfully!');
      
      return { success: true, datasetId };
    } catch (error) {
      console.error('Failed to create listing:', error);
      toast.error('Failed to create dataset listing.');
      return { success: false, error };
    } finally {
      setIsProcessing(false);
    }
  };

  const showRoyaltyBreakdown = (distribution: RoyaltyDistribution) => {
    const message = `
      Purchase successful! 
      
      Royalty Distribution:
      • Creator: ${distribution.creatorAmount.toFixed(4)} SOL (${distribution.breakdown.creatorPercentage}%)
      • Platform: ${distribution.platformAmount.toFixed(4)} SOL (${distribution.breakdown.platformPercentage}%)
      ${distribution.referralAmount > 0 ? `• Referral: ${distribution.referralAmount.toFixed(4)} SOL (${distribution.breakdown.referralPercentage}%)` : ''}
      
      Total: ${distribution.totalPrice.toFixed(4)} SOL
    `;
    
    toast.success(message, { duration: 6000 });
  };

  const recordPurchaseWithRoyalties = async (purchaseData: any) => {
    // Store purchase with royalty information
    const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
    purchases.push(purchaseData);
    localStorage.setItem('purchases', JSON.stringify(purchases));
  };

  const getUserPurchases = async () => {
    if (!publicKey) return [];
    
    try {
      return await contract.getUserPurchases(publicKey);
    } catch (error) {
      console.error('Failed to get user purchases:', error);
      return [];
    }
  };

  const getCreatorEarnings = async () => {
    if (!publicKey) return { totalEarnings: 0, datasets: [] };
    
    // This would query the smart contract for creator earnings
    // For now, calculate from localStorage
    const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
    const creatorPurchases = purchases.filter((p: any) => 
      p.royaltyDistribution && p.datasetCreator === publicKey.toString()
    );
    
    const totalEarnings = creatorPurchases.reduce((sum: number, p: any) => 
      sum + (p.royaltyDistribution?.creatorAmount || 0), 0
    );
    
    return { totalEarnings, datasets: creatorPurchases };
  };

  return {
    purchaseDatasetWithRoyalties,
    createDatasetListing,
    getUserPurchases,
    getCreatorEarnings,
    isProcessing,
    connected,
    publicKey,
  };
};