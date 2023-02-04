import { FC } from 'react';
import pkg from '../../package.json';
import { Heading } from './Heading';
import { RequestAirdrop } from './RequestAirdrop';
import { WalletSolBalance } from './WalletSolBalance';

export const Layout: FC = ({ children }) => {
  return (
    <div className='md:hero mx-auto p-4'>
      <div className='md:hero-content flex flex-col'>
        <Heading>Solana $FUSD Faucet </Heading>
        <h4 className='md:w-full text-center text-slate-300 my-2'>
          <p>Get some Fake USD onto your devnet wallet</p>
        </h4>
        {children}
        <div className='text-center'>
          <RequestAirdrop />
          <WalletSolBalance />
        </div>
      </div>
    </div>
  );
};
