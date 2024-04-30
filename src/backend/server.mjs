import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import shortid from 'shortid';

import ProductModel, { getCurrentDayMonth } from './models/ProductModel.js';
import UserModel from './models/UserModel.js';

import { MONGODB_USERNAME, MONGODB_PASSWORD } from '../../config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

const allowedOrigins = [
  'https://product-registration-app.onrender.com',
  'http://localhost:3000',
  'http://localhost:5173',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, '../App.tsx')));

mongoose.connect(`mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@productsdatabase.zooepn0.mongodb.net/?retryWrites=true&w=majority&appName=ProductsDataBase`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Conectado ao MongoDB");
}).catch(err => {
  console.log("Erro ao se conectar ao MongoDB: ", err);
  process.exit(1);
});

app.use(express.json());

// const authenticateGetRequest = (req, res, next) => {
//   if (req.method === 'GET' && req.url.startsWith('/api')) {
//     const referringURL = req.headers.referer || req.headers.origin;

//     if (referringURL && referringURL.startsWith('https://product-registration-app.onrender.com')) {
//       return next();
//     } else {
//       return res.status(401).json({ error: "Unauthorized" });
//     }
//   }
//   next();
// }

// authenticateGetRequest
app.get('/api/users', async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { given_name, family_name, email, picture, sub } = req.body;
    const user = new UserModel({ given_name, family_name, email, picture, sub });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// authenticateGetRequest
app.get('/api/products', async (req, res) => {
  try {
    const { sub } = req.query;

    if (!sub) {
      return res.status(400).json({ error: 'Sub parameter is required' });
    }

    const products = await ProductModel.find({ user: sub });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  const { name, price, sub } = req.body;

  try {
    if (!name || !price || !sub) {
      return res.status(400).json({ error: 'Name, price and sub are required' });
    }

    const user = await UserModel.findOne({ sub });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const productId = shortid.generate();
    const date = getCurrentDayMonth();

    const product = new ProductModel({ productId, name, price, date, user: user.sub });
    await product.save();

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/products', async (req, res) => {
  const { sub, productId } = req.query;

  try {
    if (!sub || !productId) {
      return res.status(400).json({ error: 'Sub and productId parameters are required' });
    }
  
    await ProductModel.findOneAndDelete({ productId, user: sub });

    res.json({ message: 'Product deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});