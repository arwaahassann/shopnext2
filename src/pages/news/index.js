import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import styles from '@/styles/News.module.css';

const TOASTS = [
  '🔥 Breaking: New products just dropped!',
  '📦 Free shipping on orders over $50',
  '⚡ Flash sale: 20% off electronics today',
  '🎉 500 new users joined this week!',
];

export async function getServerSideProps() {
  const res = await fetch('https://dummyjson.com/posts?limit=12');
  const data = await res.json();
  const toast = TOASTS[Math.floor(Math.random() * TOASTS.length)];
  return { props: { posts: data.posts, toast } };
}

export default function News({ posts, toast }) {
  const { data: session } = useSession();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!session) return;
    const t = setTimeout(() => setShowToast(true), 100);
    const hide = setTimeout(() => setShowToast(false), 4100);
    return () => { clearTimeout(t); clearTimeout(hide); };
  }, [session]);

  return (
    <div className={styles.container}>
      {showToast && session && <div className={styles.toast}>{toast}</div>}

      {!session && (
        <div className={styles.guestNote}>
          🔒 Sign in to see live notifications on this page.{' '}
          <Link href="/dashboard/login">Sign in</Link>
        </div>
      )}

      <h1 className={styles.title}>News <span>SSR · fresh on every request</span></h1>
      <div className={styles.grid}>
        {posts.map((post) => (
          <div key={post.id} className={styles.card}>
            <div className={styles.cardBody}>
              <div className={styles.tags}>
                {post.tags?.map((t) => <span key={t} className={styles.tag}>{t}</span>)}
              </div>
              <h3>{post.title}</h3>
              <p>{post.body?.slice(0, 120)}...</p>
              <div className={styles.meta}>
                <span>👍 {post.reactions?.likes}</span>
                <span>👀 {post.views} views</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
