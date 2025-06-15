import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL,
  TransactionInstruction,
  AccountMeta
} from '@solana/web3.js';
import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor';

export interface DatasetListing {
  id: string;
  creator: PublicKey;
  price: number; // in SOL
  royaltyPercentage: number; // percentage (e.g., 70 for 70%)
  title: string;
  metadataUri: string;
  isActive: boolean;
}

export interface RoyaltyConfig {
  creatorRoyalty: number; // percentage to original creator (70%)
  platformFee: number; // percentage to platform (30%)
  referralFee?: number; // percentage to referrer (optional, comes from platform share)
}

export class DatasetMarketplaceContract {
  private connection: Connection;
  private programId: PublicKey;
  private platformWallet: PublicKey;

  constructor(connection: Connection, platformWalletAddress?: string) {
    this.connection = connection;
    // This would be your deployed program ID
    this.programId = new PublicKey('2vwoUkiNArxn2YJZihzSLApxHcmFDA2933Fdy2kFzxbV');
    // Use your wallet address here - replace with your actual wallet
    this.platformWallet = new PublicKey(platformWalletAddress || '2vwoUkiNArxn2YJZihzSLApxHcmFDA2933Fdy2kFzxbV');
  }

  async createDatasetListing(
    creator: PublicKey,
    dataset: Omit<DatasetListing, 'creator' | 'id' | 'isActive'>
  ): Promise<string> {
    const datasetId = web3.Keypair.generate().publicKey;
    
    // Create the listing account
    const transaction = new Transaction();
    
    // Add instruction to create dataset listing
    const createListingInstruction = new TransactionInstruction({
      keys: [
        { pubkey: creator, isSigner: true, isWritable: false },
        { pubkey: datasetId, isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      programId: this.programId,
      data: Buffer.from([
        0, // instruction discriminator for create_listing
        ...new BN(dataset.price * LAMPORTS_PER_SOL).toArray('le', 8),
        70, // Fixed 70% to creator
        ...Buffer.from(dataset.title),
        ...Buffer.from(dataset.metadataUri),
      ]),
    });

    transaction.add(createListingInstruction);
    
    return datasetId.toString();
  }

  async purchaseDataset(
    buyer: PublicKey,
    datasetId: string,
    dataset: DatasetListing,
    referrer?: PublicKey
  ): Promise<{ transaction: Transaction; royaltyDistribution: RoyaltyDistribution }> {
    const transaction = new Transaction();
    const datasetPubkey = new PublicKey(datasetId);
    
    // Calculate royalty distribution with 70/30 split
    const royaltyDistribution = this.calculateRoyalties(dataset.price, {
      creatorRoyalty: 70, // 70% to creator
      platformFee: 30, // 30% to platform (you)
      referralFee: referrer ? 2 : 0, // 2% referral bonus (comes from platform share)
    });

    // Transfer to creator (70%)
    if (royaltyDistribution.creatorAmount > 0) {
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: buyer,
          toPubkey: dataset.creator,
          lamports: royaltyDistribution.creatorAmount * LAMPORTS_PER_SOL,
        })
      );
    }

    // Transfer to platform (you) - 30% minus referral if applicable
    const platformAmount = referrer 
      ? royaltyDistribution.platformAmount - royaltyDistribution.referralAmount
      : royaltyDistribution.platformAmount;
    
    if (platformAmount > 0) {
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: buyer,
          toPubkey: this.platformWallet,
          lamports: platformAmount * LAMPORTS_PER_SOL,
        })
      );
    }

    // Transfer to referrer if exists (2% from platform share)
    if (referrer && royaltyDistribution.referralAmount > 0) {
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: buyer,
          toPubkey: referrer,
          lamports: royaltyDistribution.referralAmount * LAMPORTS_PER_SOL,
        })
      );
    }

    // Add purchase instruction to smart contract
    const purchaseInstruction = new TransactionInstruction({
      keys: [
        { pubkey: buyer, isSigner: true, isWritable: true },
        { pubkey: dataset.creator, isSigner: false, isWritable: true },
        { pubkey: datasetPubkey, isSigner: false, isWritable: true },
        { pubkey: this.platformWallet, isSigner: false, isWritable: true },
        ...(referrer ? [{ pubkey: referrer, isSigner: false, isWritable: true }] : []),
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      programId: this.programId,
      data: Buffer.from([
        1, // instruction discriminator for purchase
        ...new PublicKey(datasetId).toBuffer(),
        ...(referrer ? referrer.toBuffer() : Buffer.alloc(32)),
      ]),
    });

    transaction.add(purchaseInstruction);

    return { transaction, royaltyDistribution };
  }

  private calculateRoyalties(
    totalPrice: number,
    config: RoyaltyConfig
  ): RoyaltyDistribution {
    const creatorAmount = (totalPrice * config.creatorRoyalty) / 100;
    const platformAmount = (totalPrice * config.platformFee) / 100;
    const referralAmount = config.referralFee ? (totalPrice * config.referralFee) / 100 : 0;
    
    return {
      totalPrice,
      creatorAmount,
      platformAmount,
      referralAmount,
      breakdown: {
        creatorPercentage: config.creatorRoyalty,
        platformPercentage: config.platformFee,
        referralPercentage: config.referralFee || 0,
      }
    };
  }

  async getDatasetListing(datasetId: string): Promise<DatasetListing | null> {
    try {
      // This would fetch from your smart contract state
      // For now, return mock data
      return null;
    } catch (error) {
      console.error('Failed to fetch dataset listing:', error);
      return null;
    }
  }

  async getUserPurchases(userWallet: PublicKey): Promise<string[]> {
    // This would query the smart contract for user's purchases
    // For now, return empty array
    return [];
  }

  // Method to update platform wallet (for you to change it later if needed)
  setPlatformWallet(newWallet: string) {
    this.platformWallet = new PublicKey(newWallet);
  }
}

export interface RoyaltyDistribution {
  totalPrice: number;
  creatorAmount: number;
  platformAmount: number;
  referralAmount: number;
  breakdown: {
    creatorPercentage: number;
    platformPercentage: number;
    referralPercentage: number;
  };
}