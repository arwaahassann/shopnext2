import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LoginClient from "./LoginClient";

export const metadata = { title: "Sign In · ShopNext" };

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/dashboard"); // لو logged in مش محتاج ترجع هنا

  return <LoginClient />;
}
