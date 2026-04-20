import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export async function getStaticProps() {
  try {
    const res = await fetch('https://dummyjson.com/products?limit=100&select=id,title,price,thumbnail,category,brand');
    const data = await res.json();
    const categories = [...new Set(data.products.map(p => p.category))];
    const brands = [...new Set(data.products.map(p => p.brand).filter(Boolean))];
    return { props: { products: data.products, categories, brands } };
  } catch {
    return { props: { products: [], categories: [], brands: [] } };
  }
}

const btn = (extra = {}) => ({
  padding: '8px 16px',
  borderRadius: 8,
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'Poppins, sans-serif',
  fontWeight: 500,
  fontSize: '0.85rem',
  ...extra,
});

const input = {
  padding: '9px 14px',
  borderRadius: 8,
  border: '1px solid #e0e0e0',
  background: '#fff',
  fontFamily: 'Poppins, sans-serif',
  fontSize: '0.88rem',
  outline: 'none',
  color: '#333',
};

export default function Products({ products, categories, brands }) {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('');
  const [brand, setBrand] = useState('');
  const [list, setList] = useState(products);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', price: '', category: '', brand: '' });
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const filtered = list.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) &&
    (cat ? p.category === cat : true) &&
    (brand ? p.brand === brand : true)
  );

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await fetch(`https://dummyjson.com/products/${id}`, { method: 'DELETE' });
    setList(prev => prev.filter(p => p.id !== id));
    showToast('Deleted successfully!');
  };

  const handleAdd = async () => {
    if (!form.title) return;
    const res = await fetch('https://dummyjson.com/products/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, price: parseFloat(form.price) || 0 }),
    });
    const newP = await res.json();
    setList(prev => [{ ...newP, thumbnail: 'https://dummyjson.com/icon/dummyjson/128' }, ...prev]);
    setShowModal(false);
    setForm({ title: '', price: '', category: '', brand: '' });
    showToast('Product added!');
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#222' }}>
          Products <span style={{ color: '#aaa', fontWeight: 400, fontSize: '1rem' }}>({filtered.length})</span>
        </h1>
        <button onClick={() => setShowModal(true)} style={btn({ background: '#4f6ef7', color: '#fff' })}>
          + Add Product
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', color: '#2e7d32', padding: '10px 16px', borderRadius: 8, marginBottom: 16, fontSize: '0.88rem' }}>
          {toast}
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
        <input style={{ ...input, flex: 1, minWidth: 160 }} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        <select style={input} value={cat} onChange={e => setCat(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select style={input} value={brand} onChange={e => setBrand(e.target.value)}>
          <option value="">All Brands</option>
          {brands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        {(search || cat || brand) && (
          <button onClick={() => { setSearch(''); setCat(''); setBrand(''); }} style={btn({ background: '#f0f0f0', color: '#666' })}>
            Clear
          </button>
        )}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 16 }}>
        {filtered.map(p => (
          <div key={p.id} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8e8e8', overflow: 'hidden' }}>
            <Link href={`/products/${p.id}`}>
              <Image src={p.thumbnail} alt={p.title} width={300} height={160}
                style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />
            </Link>
            <div style={{ padding: '12px 14px' }}>
              <p style={{ fontSize: '0.7rem', color: '#4f6ef7', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>{p.category}</p>
              <Link href={`/products/${p.id}`}>
                <p style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</p>
              </Link>
              {p.brand && <p style={{ fontSize: '0.78rem', color: '#999', marginBottom: 8 }}>{p.brand}</p>}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: '#4f6ef7' }}>${p.price}</span>
                <button onClick={() => handleDelete(p.id)} style={btn({ background: '#fff0f0', color: '#e53935', border: '1px solid #ffcdd2', padding: '5px 10px' })}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div onClick={() => setShowModal(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 420,
            display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 4 }}>Add New Product</h2>
            {['title', 'price', 'category', 'brand'].map(field => (
              <input key={field} placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                type={field === 'price' ? 'number' : 'text'}
                value={form[field]}
                onChange={e => setForm({ ...form, [field]: e.target.value })}
                style={{ ...input, width: '100%' }} />
            ))}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
              <button onClick={() => setShowModal(false)} style={btn({ background: '#f5f5f5', color: '#666' })}>Cancel</button>
              <button onClick={handleAdd} style={btn({ background: '#4f6ef7', color: '#fff' })}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
