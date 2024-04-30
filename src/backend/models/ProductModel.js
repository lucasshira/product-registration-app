import mongoose from "mongoose";
import shortid from 'shortid';

export const getCurrentDayMonth = () => {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;

  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;

  return `${formattedDay}/${formattedMonth}`;
};

const productSchema = new mongoose.Schema({
  productId: { type: String, required: true, default: shortid.generate },
  name: { type: String, required: true },
  price: { type: Number, default: 0 },
  user: { type: String, required: true },
  date: { type: String, required: true, default: getCurrentDayMonth }
});

const Product = mongoose.model('Product', productSchema);

export default Product;