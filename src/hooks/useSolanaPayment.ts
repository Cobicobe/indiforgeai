import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction
} from '@solana/web3.js';
import { useState } from 'react';
import toast from 'react-hot-toast';

export interface PaymentDetails {
  amount: number; // in SOL
  recipient: string; // wallet address
  description: string;
  datasetId?: string;
}

export const useSolanaPayment = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();
  const [isProcessing, setIsProcessing] = useState(false);

  const processPayment = async (paymentDetails: PaymentDetails) => {
    if (!connected || !publicKey) {
      toast.error('Please connect your wallet first');
      return false;
    }

    setIsProcessing(true);
    
    try {
      const recipientPublicKey = new PublicKey(paymentDetails.recipient);
      const lamports = paymentDetails.amount * LAMPORTS_PER_SOL;

      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPublicKey,
          lamports,
        })
      );

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Send transaction
      const signature = await sendTransaction(transaction, connection);
      
      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed');
      
      toast.success(`Payment successful! Transaction: ${signature.slice(0, 8)}...`);
      
      // Here you would typically call your backend to record the purchase
      await recordPurchase({
        signature,
        amount: paymentDetails.amount,
        datasetId: paymentDetails.datasetId,
        buyerWallet: publicKey.toString(),
        description: paymentDetails.description,
      });

      return { success: true, signature };
    } catch (error) {
      console.error('Payment failed:', error);
      toast.error('Payment failed. Please try again.');
      return { success: false, error };
    } finally {
      setIsProcessing(false);
    }
  };

  const recordPurchase = async (purchaseData: any) => {
    // This would typically call your backend API to record the purchase
    // For now, we'll just store it in localStorage as a demo
    const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
    purchases.push({
      ...purchaseData,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('purchases', JSON.stringify(purchases));
  };

  const getBalance = async () => {
    if (!connected || !publicKey) return 0;
    
    try {
      const balance = await connection.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Failed to get balance:', error);
      return 0;
    }
  };

  return {
    processPayment,
    getBalance,
    isProcessing,
    connected,
    publicKey,
  };
};