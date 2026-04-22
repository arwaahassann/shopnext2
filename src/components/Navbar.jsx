'use client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const active = (href) => router.pathname === href || router.pathname.startsWith(href + '/') ? styles.active : '';

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>ShopNext</Link>
      <div className={styles.links}>
        <Link href="/" className={router.pathname === '/' ? styles.active : ''}>Home</Link>
        <Link href="/products" className={active('/products')}>Products</Link>
        {session && (
          <>
            <Link href="/news" className={router.pathname === '/news' ? styles.active : ''}>News</Link>
            <Link href="/cart" className={router.pathname === '/cart' ? styles.active : ''}>Cart</Link>
            <Link href="/dashboard" className={router.pathname.startsWith('/dashboard') ? styles.active : ''}>Dashboard</Link>
          </>
        )}
      </div>
      <div className={styles.authArea}>
        {session ? (
          <button className={styles.signOutBtn} onClick={() => signOut({ callbackUrl: '/' })}>Sign out</button>
        ) : (
          <Link href="/dashboard/login" className={styles.signInBtn}>Sign in</Link>
        )}
      </div>
    </nav>
  );
}
