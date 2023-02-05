import { AppProps } from 'next/app';
import Head from 'next/head';
import { FC } from 'react';
import { ContextProvider } from '../contexts/ContextProvider';
import { AppBar } from '../components/AppBar';
import { ContentContainer } from '../components/ContentContainer';
import { Footer } from '../components/Footer';
import Notifications from '../components/Notification';
import { Layout } from 'components/Layout';

require('@solana/wallet-adapter-react-ui/styles.css');
require('../styles/globals.css');

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Solana SPL Faucet</title>
        <meta name='description' content='Solana SPL Faucet' />
      </Head>

      <ContextProvider>
        <div className='h-screen'>
          <Notifications />
          <ContentContainer>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ContentContainer>
        </div>
      </ContextProvider>
    </>
  );
};

export default App;
