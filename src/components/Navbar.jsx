import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const { pathname } = useRouter();
  return (
    <nav style={{
      background: '#fff',
      borderBottom: '1px solid #e8e8e8',
      padding: '14px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <Link href="/" style={{ fontWeight: 700, fontSize: '1.2rem', color: '#4f6ef7' }}>
        🛍️ ShopNext
      </Link>
      <div style={{ display: 'flex', gap: '24px' }}>
        {[['/', 'Home'], ['/products', 'Products']].map(([href, label]) => (
          <Link key={href} href={href} style={{
            fontSize: '0.9rem',
            fontWeight: 500,
            color: pathname === href || (href === '/products' && pathname.startsWith('/products')) ? '#4f6ef7' : '#666',
            borderBottom: pathname === href || (href === '/products' && pathname.startsWith('/products')) ? '2px solid #4f6ef7' : '2px solid transparent',
            paddingBottom: '2px',
          }}>{label}</Link>
        ))}
      </div>
    </nav>
  );
}
