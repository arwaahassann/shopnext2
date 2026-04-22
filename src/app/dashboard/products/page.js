import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import DashboardProductsClient from './ProductsClient';

export const dynamic = 'force-dynamic';

export default async function DashboardProductsPage() {
  await auth();
  await dbConnect();
  const raw = await Product.find({}).sort({ createdAt: -1 }).lean();
  const products = raw.map((p) => ({ ...p, _id: p._id.toString(), createdAt: p.createdAt?.toString(), updatedAt: p.updatedAt?.toString() }));

  return <DashboardProductsClient initialProducts={products} />;
}
