import '@/styles/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const { pathname } = useRouter();
  const isError = pathname === '/404' || pathname === '/500' || pathname === '/_error';

  return (
    <div className="layout">
      {!isError && <Navbar />}
      <main><Component {...pageProps} /></main>
      {!isError && <Footer />}
    </div>
  );
}
