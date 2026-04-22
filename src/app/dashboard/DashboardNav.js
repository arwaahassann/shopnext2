'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Image from 'next/image';

export default function DashboardNav({ user }) {
  const path = usePathname();
  const active = (href) => path === href ? 'dash-link active' : 'dash-link';

  return (
    <nav className="dash-nav">
      <Link href="/" className="dash-logo">ShopNext</Link>
      <div className="dash-links">
        <Link href="/dashboard" className={active('/dashboard')}>Overview</Link>
        <Link href="/dashboard/products" className={active('/dashboard/products')}>Products</Link>
      </div>
      <div className="dash-user">
        {user?.image && (
          <Image src={user.image} alt={user.name || ''} width={28} height={28}
            style={{ borderRadius: '50%', border: '2px solid var(--border)' }} />
        )}
        <span>{user?.name?.split(' ')[0]}</span>
        <button className="dash-logout" onClick={() => signOut({ callbackUrl: '/' })}>Sign out</button>
      </div>
    </nav>
  );
}
