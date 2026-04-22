import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from '@/styles/ProductDetail.module.css';

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const isMongoId = /^[a-f\d]{24}$/i.test(params.id);
  if (!isMongoId) {
    try {
      const res = await fetch(`https://dummyjson.com/products/${params.id}`);
      if (!res.ok) return { notFound: true };
      const product = await res.json();
      return { props: { product: { ...product, _id: String(product.id) } }, revalidate: 30 };
    } catch {
      return { notFound: true };
    }
  }
  return { props: { product: null }, revalidate: 30 };
}

export default function ProductDetail({ product: initialProduct }) {
  const router = useRouter();
  const [product, setProduct] = useState(initialProduct);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState('');
  const [cartMsg, setCartMsg] = useState('');

  const flash = (setter, text) => { setter(text); setTimeout(() => setter(''), 2500); };

  useEffect(() => {
    const id = router.query.id;
    if (!id) return;
    const isMongoId = /^[a-f\d]{24}$/i.test(id);
    if (isMongoId) {
      fetch(`/api/products/${id}`)
        .then((r) => r.json())
        .then((data) => {
          setProduct(data);
          setForm({ title: data.title, price: data.price, description: data.description, thumbnail: data.thumbnail });
        });
    } else if (initialProduct) {
      setForm({ title: initialProduct.title, price: initialProduct.price, description: initialProduct.description, thumbnail: initialProduct.thumbnail });
    }
  }, [router.query.id, initialProduct]);

  const handleUpdate = async () => {
    const id = product._id || product.id;
    const isMongoId = /^[a-f\d]{24}$/i.test(id);
    if (!isMongoId) { flash(setMsg, 'Edit only works for MongoDB products'); return; }
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, price: parseFloat(form.price) }),
    });
    const updated = await res.json();
    setProduct(updated);
    setEditing(false);
    flash(setMsg, 'Saved!');
  };

  const handleDelete = async () => {
    if (!confirm('Delete?')) return;
    const id = product._id || product.id;
    const isMongoId = /^[a-f\d]{24}$/i.test(id);
    if (!isMongoId) { flash(setMsg, 'Delete only works for MongoDB products'); return; }
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    router.push('/products');
  };

  const handleBuy = async () => {
    const id = product._id || product.id;
    await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: id, title: product.title, price: product.price, thumbnail: product.thumbnail }),
    });
    flash(setCartMsg, 'Added to cart!');
  };

  if (!product) return <div className={styles.container}><p>Loading...</p></div>;

  return (
    <div className={styles.container}>
      <button className={styles.back} onClick={() => router.push('/products')}>← Back</button>
      {msg && <div className={styles.msg}>{msg}</div>}
      {cartMsg && <div className={styles.cartMsg}>{cartMsg}</div>}

      <div className={styles.wrapper}>
        <div className={styles.imgBox}>
          <Image
            src={product.thumbnail || 'https://dummyjson.com/icon/dummyjson/128'}
            alt={product.title}
            width={360} height={280}
            style={{ width: '100%', height: '280px', objectFit: 'contain' }}
          />
        </div>

        <div className={styles.info}>
          <div className={styles.tags}>
            {product.category && <span className={styles.tag}>{product.category}</span>}
            {product.brand && <span className={styles.tag}>{product.brand}</span>}
          </div>

          {editing && form ? (
            <div className={styles.editForm}>
              <label className={styles.label}>Title</label>
              <input className={styles.input} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <label className={styles.label}>Price ($)</label>
              <input className={styles.input} type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              <label className={styles.label}>Description</label>
              <textarea className={styles.textarea} rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <div className={styles.actions}>
                <button className={styles.saveBtn} onClick={handleUpdate}>Save</button>
                <button className={styles.cancelBtn} onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <h1 className={styles.title}>{product.title}</h1>
              <p className={styles.price}>${product.price}</p>
              <p className={styles.desc}>{product.description}</p>
              {(product.rating || product.stock) && (
                <div className={styles.stats}>
                  {product.rating && <div className={styles.stat}><span>Rating</span><strong>{product.rating} ⭐</strong></div>}
                  {product.stock && <div className={styles.stat}><span>Stock</span><strong>{product.stock}</strong></div>}
                  {product.discountPercentage && <div className={styles.stat}><span>Discount</span><strong>{product.discountPercentage}%</strong></div>}
                </div>
              )}
              <div className={styles.actions}>
                <button className={styles.buyBtn} onClick={handleBuy}>🛒 Buy</button>
                <button className={styles.editBtn} onClick={() => setEditing(true)}>Edit</button>
                <button className={styles.deleteBtn} onClick={handleDelete}>Delete</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
