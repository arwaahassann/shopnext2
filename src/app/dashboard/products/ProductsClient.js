'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function DashboardProductsClient({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState({ title: '', price: '', category: '', brand: '', description: '', thumbnail: '' });
  const [msg, setMsg] = useState('');

  const flash = (text) => { setMsg(text); setTimeout(() => setMsg(''), 2500); };

  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setForm({ title: '', price: '', category: '', brand: '', description: '', thumbnail: '' });
    setEditTarget(null);
    setShowAdd(true);
  };

  const openEdit = (p) => {
    setForm({ title: p.title, price: p.price, category: p.category, brand: p.brand, description: p.description, thumbnail: p.thumbnail });
    setEditTarget(p._id);
    setShowAdd(true);
  };

  const handleSubmit = async () => {
    if (!form.title) return;
    if (editTarget) {
      const res = await fetch(`/api/products/${editTarget}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price: parseFloat(form.price) || 0 }),
      });
      const updated = await res.json();
      setProducts((prev) => prev.map((p) => (p._id === editTarget ? updated : p)));
      flash('Product updated!');
    } else {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price: parseFloat(form.price) || 0 }),
      });
      const newP = await res.json();
      setProducts((prev) => [newP, ...prev]);
      flash('Product added!');
    }
    setShowAdd(false);
    setEditTarget(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    setProducts((prev) => prev.filter((p) => p._id !== id));
    flash('Deleted.');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Products <span style={{ color: '#6b7280', fontWeight: 400, fontSize: '0.9rem' }}>{filtered.length}</span></h1>
        </div>
        <button onClick={openAdd} style={btnStyle('#4f6ef7')}>+ Add Product</button>
      </div>

      {msg && <div style={msgStyle}>{msg}</div>}

      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={inputStyle}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.2rem' }}>
        {filtered.map((p) => (
          <div key={p._id} style={cardStyle}>
            <Image
              src={p.thumbnail || 'https://dummyjson.com/icon/dummyjson/128'}
              alt={p.title}
              width={200} height={130}
              style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '8px 8px 0 0' }}
            />
            <div style={{ padding: '0.75rem' }}>
              <span style={{ fontSize: '0.7rem', color: '#4f6ef7', fontWeight: 600, textTransform: 'capitalize' }}>{p.category}</span>
              <p style={{ fontSize: '0.88rem', fontWeight: 500, margin: '0.2rem 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</p>
              <p style={{ fontWeight: 700, color: '#4f6ef7', marginBottom: '0.6rem' }}>${p.price}</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => openEdit(p)} style={btnSmall('#4f6ef7')}>Edit</button>
                <button onClick={() => handleDelete(p._id)} style={btnSmall('#ef4444')}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div style={overlayStyle} onClick={() => setShowAdd(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
              {editTarget ? 'Edit Product' : 'Add Product'}
            </h2>
            {['title', 'price', 'category', 'brand', 'description', 'thumbnail'].map((field) => (
              <input
                key={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1) + (field === 'title' ? ' *' : '')}
                type={field === 'price' ? 'number' : 'text'}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                style={{ ...inputStyle, marginBottom: '0.6rem' }}
              />
            ))}
            <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button onClick={() => setShowAdd(false)} style={btnSmall('#6b7280')}>Cancel</button>
              <button onClick={handleSubmit} style={btnStyle('#4f6ef7')}>{editTarget ? 'Save' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const btnStyle = (color) => ({
  background: color, color: '#fff', border: 'none',
  padding: '0.55rem 1.2rem', borderRadius: '8px',
  fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer',
});

const btnSmall = (color) => ({
  background: 'transparent', border: `1px solid ${color}`, color,
  padding: '0.28rem 0.7rem', borderRadius: '6px',
  fontSize: '0.78rem', cursor: 'pointer',
});

const inputStyle = {
  background: '#fff', border: '1px solid #e4e7ec', color: '#1a1a2e',
  padding: '0.55rem 0.9rem', borderRadius: '8px',
  fontSize: '0.88rem', fontFamily: 'Inter, sans-serif',
  outline: 'none', width: '100%',
};

const cardStyle = {
  background: '#fff', border: '1px solid #e4e7ec', borderRadius: '10px', overflow: 'hidden',
};

const msgStyle = {
  background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534',
  padding: '0.6rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem',
};

const overlayStyle = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999,
};

const modalStyle = {
  background: '#fff', borderRadius: '12px', padding: '1.5rem',
  width: '100%', maxWidth: '400px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
};
