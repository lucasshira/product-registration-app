import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

import ProductModel from './models/ProductModel.js';
import UserModel from './models/UserModel.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

app.use(cors());

app.use(express.static(path.join(__dirname, '../App.tsx')));

mongoose.connect('mongodb+srv://Lucas:sEnoc6rpQgH5xhdg@productsdatabase.zooepn0.mongodb.net/?retryWrites=true&w=majority&appName=ProductsDataBase', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true
}).then(() => {
  console.log("Conectado ao MongoDB");
}).catch(err => {
  console.log("Erro ao se conectar ao MongoDB: ", err);
  process.exit(1);
});

app.use(express.json());

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
    const { given_name, family_name, email, picture } = req.body;
    const user = new UserModel({ given_name, family_name, email, picture });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  const { name, price } = req.body;
  const userId = req.user._id; // Supondo que o ID do usuário logado está na propriedade req.user._id

  try {
    // Verifique se o usuário existe
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Crie o novo produto associado ao usuário
    const product = new ProductModel({ name, price, user: userId });

    // Salve o produto no banco de dados
    await product.save();

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});