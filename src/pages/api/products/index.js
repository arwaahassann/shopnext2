import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const { category, brand, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (search) filter.title = { $regex: search, $options: 'i' };
    const products = await Product.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(products);
  }

  if (req.method === 'POST') {
    const product = await Product.create(req.body);
    return res.status(201).json(product);
  }

  res.status(405).end();
}
