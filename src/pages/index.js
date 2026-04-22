import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/Home.module.css';

export async function getStaticProps() {
  try {
    const res = await fetch('https://dummyjson.com/products?limit=6&select=id,title,price,thumbnail,category');
    const data = await res.json();
    return { props: { featured: data.products }, revalidate: 60 };
  } catch {
    return { props: { featured: [] }, revalidate: 60 };
  }
}

export default function Home({ featured }) {
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState('');

  const handleSeed = async () => {
    setSeeding(true);
    const res = await fetch('/api/seed', { method: 'POST' });
    const data = await res.json();
    setSeedMsg(data.message);
    setSeeding(false);
    setTimeout(() => setSeedMsg(''), 3000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div>
          <h1>ShopNext</h1>
          <p>Full-stack Next.js · MongoDB · SSG + ISR + SSR</p>
          <div className={styles.heroActions}>
            <Link href="/products" className={styles.btn}>Browse Products</Link>
            <Link href="/cart" className={styles.btnOutline}>View Cart</Link>
          </div>
        </div>
        <div className={styles.seedBox}>
          <p className={styles.seedLabel}>First time? Seed the database from DummyJSON</p>
          <button className={styles.seedBtn} onClick={handleSeed} disabled={seeding}>
            {seeding ? 'Seeding...' : 'Seed Database'}
          </button>
          {seedMsg && <p className={styles.seedMsg}>{seedMsg}</p>}
        </div>
      </div>

      <h2 className={styles.sectionTitle}>Featured Products <span>(ISR · revalidates every 60s)</span></h2>
      <div className={styles.grid}>
        {featured.map((p) => (
          <Link href={`/products`} key={p.id} className={styles.card}>
            <Image src={p.thumbnail} alt={p.title} width={200} height={140}
              style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
            <div className={styles.cardBody}>
              <span className={styles.cat}>{p.category}</span>
              <p className={styles.name}>{p.title}</p>
              <p className={styles.price}>${p.price}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className={styles.navLinks}>
        <Link href="/products" className={styles.navCard}>
          <strong>Products</strong>
          <span>ISR · Full CRUD via MongoDB</span>
        </Link>
        <Link href="/news" className={styles.navCard}>
          <strong>News</strong>
          <span>SSR · Random toast on every request</span>
        </Link>
        <Link href="/cart" className={styles.navCard}>
          <strong>Cart</strong>
          <span>Buy products · See total price</span>
        </Link>
      </div>
    </div>
  );
}
