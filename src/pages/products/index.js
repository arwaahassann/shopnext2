import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import styles from '@/styles/Products.module.css';

export async function getStaticProps() {
  try {
    const res = await fetch('https://dummyjson.com/products?limit=100&select=id,title,price,thumbnail,category,brand');
    const data = await res.json();
    const categories = [...new Set(data.products.map((p) => p.category))];
    const brands = [...new Set(data.products.map((p) => p.brand).filter(Boolean))];
    return { props: { initialProducts: data.products, categories, brands }, revalidate: 30 };
  } catch {
    return { props: { initialProducts: [], categories: [], brands: [] }, revalidate: 30 };
  }
}

export default function Products({ initialProducts, categories, brands }) {
  const { data: session } = useSession();
  const isAuth = !!session;

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('');
  const [brand, setBrand] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', price: '', category: '', brand: '', description: '', thumbnail: '' });
  const [msg, setMsg] = useState('');
  const [useDB, setUseDB] = useState(false);

  const flash = (text) => { setMsg(text); setTimeout(() => setMsg(''), 2500); };

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) { setProducts(data); setUseDB(true); }
        else setProducts(initialProducts);
      })
      .catch(() => setProducts(initialProducts));
  }, [initialProducts]);

  const allFiltered = products.filter((p) =>
    (p.title || '').toLowerCase().includes(search.toLowerCase()) &&
    (cat ? p.category === cat : true) &&
    (brand ? p.brand === brand : true)
  );

  const filtered = isAuth ? allFiltered : allFiltered.slice(0, 4);

  const handleAdd = async () => {
    if (!form.title) return;
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, price: parseFloat(form.price) || 0 }),
    });
    const newP = await res.json();
    setProducts((prev) => [newP, ...prev]);
    setShowAdd(false);
    setForm({ title: '', price: '', category: '', brand: '', description: '', thumbnail: '' });
    flash('Product added!');
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    setProducts((prev) => prev.filter((p) => (p._id || p.id) !== id));
    flash('Product deleted.');
  };

  const getId = (p) => p._id || p.id;

  return (
    <div className={styles.container}>
      {!isAuth && (
        <div className={styles.guestBanner}>
          Showing 4 of {allFiltered.length} products.{' '}
          <Link href="/dashboard/login">Sign in</Link> to view all & manage products.
        </div>
      )}

      <div className={styles.topBar}>
        <div>
          <h1>Products <span>{filtered.length}</span></h1>
          <p className={styles.source}>{useDB ? 'MongoDB · ISR 30s' : 'DummyJSON fallback'}</p>
        </div>
        {isAuth && (
          <button className={styles.addBtn} onClick={() => setShowAdd(true)}>+ Add</button>
        )}
      </div>

      {msg && <div className={styles.msg}>{msg}</div>}

      {isAuth && (
        <div className={styles.filters}>
          <input className={styles.input} placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className={styles.select} value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className={styles.select} value={brand} onChange={(e) => setBrand(e.target.value)}>
            <option value="">All Brands</option>
            {brands.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          {(search || cat || brand) && (
            <button className={styles.clearBtn} onClick={() => { setSearch(''); setCat(''); setBrand(''); }}>Clear</button>
          )}
        </div>
      )}

      <div className={styles.grid}>
        {filtered.map((p) => (
          <div key={getId(p)} className={styles.card}>
            <Link href={`/products/${getId(p)}`}>
              <Image src={p.thumbnail || 'https://dummyjson.com/icon/dummyjson/128'} alt={p.title}
                width={200} height={130} style={{ width: '100%', height: '130px', objectFit: 'cover' }} />
            </Link>
            <div className={styles.cardBody}>
              <span className={styles.cat}>{p.category}</span>
              <Link href={`/products/${getId(p)}`}><p className={styles.name}>{p.title}</p></Link>
              {p.brand && <p className={styles.brand}>{p.brand}</p>}
              <div className={styles.cardFooter}>
                <span className={styles.price}>${p.price}</span>
                {isAuth && (
                  <button className={styles.delBtn} onClick={() => handleDelete(getId(p))}>Delete</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!isAuth && (
        <div className={styles.lockedBanner}>
          <p>🔒 {allFiltered.length - 4} more products hidden</p>
          <Link href="/dashboard/login" className={styles.signInBtn}>Sign in to unlock all</Link>
        </div>
      )}

      {showAdd && isAuth && (
        <div className={styles.overlay} onClick={() => setShowAdd(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>Add Product</h2>
            {['title', 'price', 'category', 'brand', 'description', 'thumbnail'].map((f) => (
              <input key={f} className={styles.modalInput} placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                type={f === 'price' ? 'number' : 'text'} value={form[f]}
                onChange={(e) => setForm({ ...form, [f]: e.target.value })} />
            ))}
            <div className={styles.modalBtns}>
              <button className={styles.cancelBtn} onClick={() => setShowAdd(false)}>Cancel</button>
              <button className={styles.addBtn} onClick={handleAdd}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
