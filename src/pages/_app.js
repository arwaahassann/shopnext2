import '@/styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();
  const isError = router.pathname === '/404' || router.pathname === '/500';
  const isDashboard = router.pathname.startsWith('/dashboard');

  return (
    <SessionProvider session={session}>
      <div className="page-wrapper">
        {!isError && !isDashboard && <Navbar />}
        <main>
          <Component {...pageProps} />
        </main>
        {!isError && !isDashboard && <Footer />}
      </div>
    </SessionProvider>
  );
}
