import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const productSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, default: 0 },
  user: { type: String, required: true }
});

const Product = mongoose.model('Product', productSchema);

export default Product;