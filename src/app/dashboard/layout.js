import { auth } from "@/auth";
import DashboardNav from "./DashboardNav";
import "./dashboard.css";

export const metadata = { title: "Dashboard · ShopNext" };

export default async function DashboardLayout({ children }) {
  const session = await auth();

  // صفحة اللوجن بتتعامل مع الحماية بنفسها
  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="dash-wrapper">
      <DashboardNav user={session.user} />
      <main className="dash-main">{children}</main>
    </div>
  );
}
