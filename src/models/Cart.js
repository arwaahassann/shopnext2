import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  title: String,
  price: Number,
  thumbnail: String,
  quantity: { type: Number, default: 1 },
});

const CartSchema = new mongoose.Schema({
  sessionId: { type: String, default: 'default' },
  items: [CartItemSchema],
}, { timestamps: true });

export default mongoose.models.Cart || mongoose.model('Cart', CartSchema);
