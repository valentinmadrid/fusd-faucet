import { FC } from 'react';
import pkg from '../../package.json';
import { Heading } from './Heading';
import { RequestAirdrop } from './RequestAirdrop';
import { WalletSolBalance } from './WalletSolBalance';

export const Layout: FC = ({ children }) => {
  return (
    <div className=' mx-auto p-4'>
      <div className=' flex flex-col w-full'>
        <h4 className='md:w-full text-black font-bold text-xl'>
          <p>SPL Token Faucet</p>
        </h4>
        {children}
      </div>
    </div>
  );
};
