import { Keypair } from '@solana/web3.js';
import { SendTransactionRequest } from 'components/SendTransactionRequest';
import { TransactionRequestQR } from 'components/TransactionRequestQR';
import useTransactionListener from 'hooks/useTransactionListener';
import type { NextPage } from 'next';
import { useMemo, useState } from 'react';

const Home: NextPage = () => {
  // Generate a public key that will be added to the transaction
  // so we can listen for it
  const reference = useMemo(() => Keypair.generate().publicKey, []);

  const [qrCode, setQrCode] = useState<boolean>(false);

  // Listen for transactions with the reference
  useTransactionListener(reference);

  return (
    <div className='hero rounded-2xl bg-base-content'>
      <div className='hero-content text-center'>
        <div className='max-w-lg flex flex-col gap-6'>
          <h1 className='text-3xl font-bold text-primary'>
            Transaction Request
          </h1>
          <button
            className='bg-black p-3 rounded-md'
            onClick={() => setQrCode(true)}
          >
            Or use a Solana Pay QR Code
          </button>
          <SendTransactionRequest reference={reference} />
          {qrCode && <TransactionRequestQR reference={reference} />}
        </div>
      </div>
    </div>
  );
};

export default Home;
