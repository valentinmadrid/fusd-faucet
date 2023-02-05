import { createQR, encodeURL, TransactionRequestURLFields } from '@solana/pay';
import { PublicKey } from '@solana/web3.js';
import { useNetworkConfiguration } from 'contexts/NetworkConfigurationProvider';
import { FC, useEffect, useRef } from 'react';

type TransactionRequestQRProps = {
  reference: PublicKey;
  mint?: PublicKey;
  amount?: number;
};

export const TransactionRequestQR: FC<TransactionRequestQRProps> = ({
  reference,
  mint,
  amount,
}) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const { networkConfiguration } = useNetworkConfiguration();

  useEffect(() => {
    console.log(mint?.toBase58(), amount);
    // window.location is only available in the browser, so create the URL in here
    const { location } = window;
    const apiUrl = `${location.protocol}//${
      location.host
    }/api/transaction?network=${networkConfiguration}&reference=${reference.toBase58()}&mint=${mint?.toBase58()}&amount=${amount.toString()}`;
    const urlParams: TransactionRequestURLFields = {
      link: new URL(apiUrl),
      label: `${amount} Airdrop`,
    };
    console.log(apiUrl);
    const solanaUrl = encodeURL(urlParams);

    const qr = createQR(solanaUrl, 300, 'transparent');
    qr.update({ backgroundOptions: { round: 1000 } });
    if (qrRef.current) {
      qrRef.current.innerHTML = '';
      qr.append(qrRef.current);
    }
  }, [networkConfiguration, reference, amount, mint]);

  return (
    <div className='rounded-2xl'>
      <div ref={qrRef} />
    </div>
  );
};
