import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Keypair, PublicKey } from '@solana/web3.js';
import { SendTransactionRequest } from 'components/SendTransactionRequest';
import { TransactionRequestQR } from 'components/TransactionRequestQR';
import useTransactionListener from 'hooks/useTransactionListener';
import type { NextPage } from 'next';
import { useMemo, useState } from 'react';

const Home: NextPage = () => {
  const reference = useMemo(() => Keypair.generate().publicKey, []);

  const [amount, setAmount] = useState<number>(100);

  const [faucets, setFaucets] = useState([
    {
      mint: new PublicKey('CgPG8inVvG3S6BpP6CWN1XY2swMXU1iPqgfYNaSMp5dd'),
      imageUri:
        'https://toppng.com/uploads/preview/gold-coins-11530998393xtf85riude.png',
      name: '$SGOLD',
      qrCode: false,
      maxWithdrawal: 10_000,
    },
    {
      mint: new PublicKey('4HZCNvobxtDA3uezTGmDAEqVLp7oo73UrnbxNeUMszd4'),
      qrCode: false,
      imageUri:
        'https://vl6ks7upd7eeojhodkolrh4kvjxdvg32q35rb2mgskqzjzrj35yq.arweave.net/qvypfo8fyEck7hqcuJ-Kqm46m3qG-xDphpKhlOYp33E?ext=png',
      name: '$FUSD',
      maxWithdrawal: 10_000,
    },
  ]);

  // Listen for transactions with the reference
  useTransactionListener(reference);

  return (
    <div>
      <p className='text-black'>You are limited to one airdrop every minute</p>
      <div className='bg-slate-300 rounded-lg shadow-xl p-4 mt-2'>
        <div>
          <WalletMultiButton style={{ backgroundColor: 'blue' }} />

          <input
            type='number'
            className='bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded my-3'
            value={amount}
            placeholder='Amount'
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>
        <div className='grid gap-4 sm:grid-cols-1 md:grid-cols-2'>
          {faucets.map((faucet) => (
            <div
              className='bg-white rounded-lg shadow-lg p-4'
              key={faucet.mint.toBase58()}
            >
              <div className='flex flex-col items-center'>
                <img
                  className='w-16 h-16 rounded-full mb-2'
                  src={faucet.imageUri}
                  alt={faucet.name}
                />
                <div className='text-center'>
                  <h2 className='text-lg font-medium text-black'>
                    {faucet.name}
                  </h2>
                  <p className='text-gray-600'>
                    Max Amount: {faucet.maxWithdrawal}
                  </p>

                  <button
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-3'
                    onClick={() =>
                      setFaucets((faucets) =>
                        faucets.map((f) =>
                          f.mint.equals(faucet.mint)
                            ? { ...f, qrCode: !f.qrCode }
                            : f
                        )
                      )
                    }
                  >
                    {' '}
                    {faucet.qrCode ? 'Use Wallet' : 'Use a QR Code'}
                  </button>

                  {faucet.qrCode ? (
                    <TransactionRequestQR
                      reference={reference}
                      amount={amount}
                      mint={faucet.mint}
                    />
                  ) : (
                    <SendTransactionRequest
                      reference={reference}
                      amount={amount}
                      mint={faucet.mint}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
