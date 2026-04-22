import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  await dbConnect();
  const count = await Product.countDocuments();
  if (count > 0) return res.status(200).json({ message: 'Already seeded', count });
  const r = await fetch('https://dummyjson.com/products?limit=100');
  const data = await r.json();
  const docs = data.products.map((p) => ({
    title: p.title, price: p.price, category: p.category,
    brand: p.brand || '', description: p.description, thumbnail: p.thumbnail,
  }));
  await Product.insertMany(docs);
  res.status(201).json({ message: 'Seeded', count: docs.length });
}
