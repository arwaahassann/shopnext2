import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/dashboard/login");

  return (
    <div>
      <h1
        style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.4rem" }}
      >
        Welcome back, {session?.user?.name?.split(" ")[0]} 👋
      </h1>
      <p style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: "2rem" }}>
        Signed in as {session?.user?.email}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "1rem",
        }}
      >
        <Link href="/dashboard/products" style={cardStyle}>
          <strong style={{ display: "block", marginBottom: "0.3rem" }}>
            Products
          </strong>
          <span style={{ fontSize: "0.82rem", color: "#6b7280" }}>
            Full CRUD · MongoDB
          </span>
        </Link>
        <Link href="/products" style={cardStyle}>
          <strong style={{ display: "block", marginBottom: "0.3rem" }}>
            Public Store
          </strong>
          <span style={{ fontSize: "0.82rem", color: "#6b7280" }}>
            View as guest
          </span>
        </Link>
        <Link href="/news" style={cardStyle}>
          <strong style={{ display: "block", marginBottom: "0.3rem" }}>
            News
          </strong>
          <span style={{ fontSize: "0.82rem", color: "#6b7280" }}>
            SSR · Live feed
          </span>
        </Link>
        <Link href="/cart" style={cardStyle}>
          <strong style={{ display: "block", marginBottom: "0.3rem" }}>
            Cart
          </strong>
          <span style={{ fontSize: "0.82rem", color: "#6b7280" }}>
            Your purchases
          </span>
        </Link>
      </div>
    </div>
  );
}

const cardStyle = {
  display: "block",
  background: "#fff",
  border: "1px solid #e4e7ec",
  borderRadius: "10px",
  padding: "1.2rem",
  textDecoration: "none",
  color: "#1a1a2e",
  transition: "border-color 0.15s",
};
