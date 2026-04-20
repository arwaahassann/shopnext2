import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  try {
    const res = await fetch(`https://dummyjson.com/products/${params.id}`);
    if (!res.ok) return { notFound: true };
    const product = await res.json();
    return { props: { product } };
  } catch {
    return { notFound: true };
  }
}

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 8,
  border: '1px solid #e0e0e0',
  fontFamily: 'Poppins, sans-serif',
  fontSize: '0.9rem',
  outline: 'none',
  color: '#333',
  background: '#fafafa',
};

export default function ProductDetail({ product }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title: product.title, price: product.price, description: product.description });
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleUpdate = async () => {
    await fetch(`https://dummyjson.com/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, price: parseFloat(form.price) }),
    });
    setEditing(false);
    showToast('Product updated!');
  };

  const handleDelete = async () => {
    if (!confirm('Delete this product?')) return;
    await fetch(`https://dummyjson.com/products/${product.id}`, { method: 'DELETE' });
    router.push('/products');
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
      <button onClick={() => router.push('/products')} style={{
        background: 'none', border: '1px solid #e0e0e0', borderRadius: 8,
        padding: '8px 16px', cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
        fontSize: '0.85rem', color: '#666', marginBottom: 24,
      }}>
        ← Back
      </button>

      {toast && (
        <div style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', color: '#2e7d32', padding: '10px 16px', borderRadius: 8, marginBottom: 20, fontSize: '0.88rem' }}>
          {toast}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, background: '#fff', borderRadius: 16, border: '1px solid #e8e8e8', padding: 32 }}>
        {/* Image */}
        <div>
          <Image src={product.thumbnail} alt={product.title} width={400} height={340}
            style={{ width: '100%', height: 340, objectFit: 'contain', borderRadius: 12, background: '#f5f7fa' }} />
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            {[['⭐ Rating', product.rating], ['📦 Stock', product.stock], ['🏷️ Discount', `${product.discountPercentage}%`]].map(([label, val]) => (
              <div key={label} style={{ flex: 1, background: '#f5f7fa', borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
                <p style={{ fontSize: '0.72rem', color: '#999', marginBottom: 2 }}>{label}</p>
                <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ background: '#eef0ff', color: '#4f6ef7', borderRadius: 999, padding: '3px 12px', fontSize: '0.75rem', fontWeight: 600 }}>{product.category}</span>
            {product.brand && <span style={{ background: '#f5f5f5', color: '#666', borderRadius: 999, padding: '3px 12px', fontSize: '0.75rem', fontWeight: 600 }}>{product.brand}</span>}
          </div>

          {editing ? (
            <>
              <label style={{ fontSize: '0.78rem', color: '#999', fontWeight: 600 }}>Title</label>
              <input style={inputStyle} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              <label style={{ fontSize: '0.78rem', color: '#999', fontWeight: 600 }}>Price ($)</label>
              <input style={inputStyle} type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
              <label style={{ fontSize: '0.78rem', color: '#999', fontWeight: 600 }}>Description</label>
              <textarea style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button onClick={handleUpdate} style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: '#4f6ef7', color: '#fff', fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>Save</button>
                <button onClick={() => setEditing(false)} style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid #e0e0e0', background: '#fff', color: '#666', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.3, color: '#222' }}>{form.title}</h1>
              <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#4f6ef7' }}>${form.price}</p>
              <p style={{ color: '#777', fontSize: '0.9rem', lineHeight: 1.7 }}>{form.description}</p>
              <div style={{ display: 'flex', gap: 10, marginTop: 'auto', paddingTop: 12 }}>
                <button onClick={() => setEditing(true)} style={{ flex: 1, padding: '11px', borderRadius: 8, border: 'none', background: '#4f6ef7', color: '#fff', fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>Edit</button>
                <button onClick={handleDelete} style={{ flex: 1, padding: '11px', borderRadius: 8, border: '1px solid #ffcdd2', background: '#fff0f0', color: '#e53935', fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>Delete</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
