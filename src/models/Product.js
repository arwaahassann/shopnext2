import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, default: '' },
  brand: { type: String, default: '' },
  description: { type: String, default: '' },
  thumbnail: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
