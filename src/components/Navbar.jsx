// src/components/Navbar.jsx
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const router = useRouter();
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>
        ShopNext
      </Link>
      <div className={styles.links}>
        <Link href="/" className={router.pathname === "/" ? styles.active : ""}>
          Home
        </Link>
        <Link
          href="/products"
          className={
            router.pathname.startsWith("/products") ? styles.active : ""
          }
        >
          Products
        </Link>
        <Link
          href="/news"
          className={router.pathname === "/news" ? styles.active : ""}
        >
          News
        </Link>
        <Link
          href="/cart"
          className={router.pathname === "/cart" ? styles.active : ""}
        >
          Cart
        </Link>
      </div>
    </nav>
  );
}
