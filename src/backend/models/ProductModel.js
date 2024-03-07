import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, default: '' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Referência ao usuário
});

const Product = mongoose.model('Product', productSchema);

export default Product;