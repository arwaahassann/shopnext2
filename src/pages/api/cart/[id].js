import dbConnect from '@/lib/dbConnect';
import Cart from '@/models/Cart';

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  if (req.method === 'DELETE') {
    const cart = await Cart.findOne({ sessionId: 'default' });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = cart.items.filter((i) => i._id.toString() !== id);
    await cart.save();
    return res.status(200).json(cart);
  }

  res.status(405).end();
}
