import dbConnect from '@/lib/dbConnect';
import Cart from '@/models/Cart';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    let cart = await Cart.findOne({ sessionId: 'default' });
    if (!cart) cart = { items: [] };
    return res.status(200).json(cart);
  }

  if (req.method === 'POST') {
    const { productId, title, price, thumbnail } = req.body;
    let cart = await Cart.findOne({ sessionId: 'default' });
    if (!cart) cart = new Cart({ sessionId: 'default', items: [] });

    const existing = cart.items.find((i) => i.productId.toString() === productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.items.push({ productId, title, price, thumbnail, quantity: 1 });
    }
    await cart.save();
    return res.status(200).json(cart);
  }

  res.status(405).end();
}
