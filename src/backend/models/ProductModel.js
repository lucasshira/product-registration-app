import mongoose from "mongoose";
import shortid from 'shortid';

const productSchema = new mongoose.Schema({
  productId: { type: String, required: true, default: shortid.generate },
  name: { type: String, required: true },
  price: { type: Number, default: 0 },
  user: { type: String, required: true }
});

const Product = mongoose.model('Product', productSchema);

export default Product;