import Link from 'next/link';

export default function Custom404() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f7fa',
      textAlign: 'center',
      padding: 24,
    }}>
      <p style={{ fontSize: '5rem', marginBottom: 16 }}>🔍</p>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#222', marginBottom: 8 }}>404 - Page Not Found</h1>
      <p style={{ color: '#888', marginBottom: 28 }}>The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" style={{
        background: '#4f6ef7',
        color: '#fff',
        padding: '11px 28px',
        borderRadius: 8,
        fontWeight: 600,
        fontSize: '0.9rem',
      }}>← Go Home</Link>
    </div>
  );
}
