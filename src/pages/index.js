import Link from 'next/link';
import Image from 'next/image';

export async function getStaticProps() {
  try {
    const res = await fetch('https://dummyjson.com/products?limit=4&select=id,title,price,thumbnail,category');
    const data = await res.json();
    return { props: { featured: data.products } };
  } catch {
    return { props: { featured: [] } };
  }
}

export default function Home({ featured }) {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>

      {/* Hero */}
      <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: '48px 40px',
        marginBottom: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
        border: '1px solid #e8e8e8',
      }}>
        <div>
          <p style={{ color: '#4f6ef7', fontWeight: 600, marginBottom: 8 }}>Welcome to ShopNext</p>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, lineHeight: 1.3, marginBottom: 16, color: '#222' }}>
            Find the best<br />products for you
          </h1>
          <Link href="/products" style={{
            background: '#4f6ef7',
            color: '#fff',
            padding: '12px 28px',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: '0.95rem',
            display: 'inline-block',
          }}>
            Browse Products →
          </Link>
        </div>
        <div style={{ fontSize: '6rem' }}>🛒</div>
      </div>

      {/* Featured */}
      <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 20, color: '#333' }}>Featured Products</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 16 }}>
        {featured.map(p => (
          <Link href={`/products/${p.id}`} key={p.id} style={{
            background: '#fff',
            borderRadius: 12,
            border: '1px solid #e8e8e8',
            overflow: 'hidden',
            display: 'block',
            transition: 'box-shadow 0.2s',
          }}>
            <Image
              src={p.thumbnail}
              alt={p.title}
              width={300}
              height={180}
              style={{ width: '100%', height: 180, objectFit: 'cover' }}
            />
            <div style={{ padding: '12px 16px' }}>
              <p style={{ fontSize: '0.72rem', color: '#4f6ef7', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>{p.category}</p>
              <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</p>
              <p style={{ color: '#4f6ef7', fontWeight: 700 }}>${p.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
