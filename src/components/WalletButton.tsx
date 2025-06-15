import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Wallet } from 'lucide-react';

export const WalletButton: React.FC = () => {
  const { connected, publicKey } = useWallet();

  return (
    <div className="flex items-center gap-2">
      {connected && publicKey && (
        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
          <Wallet className="w-4 h-4" />
          <span className="font-mono">
            {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
          </span>
        </div>
      )}
      <WalletMultiButton className="!bg-teal-600 hover:!bg-teal-700 !rounded-lg !font-medium !text-sm !px-4 !py-2 !h-auto" />
    </div>
  );
};