import axios from 'axios';
import { useState } from 'react';

interface Products {
  name: string
  price: number
}

const Products = ({ userId }: { userId: string | null }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!userId) {
      console.error('ID do usuário não encontrado');
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/products", { name, price, userId });
      console.log("Novo produto criado:", response.data);
      // Limpar os campos do formulário após a criação do produto
      setName('');
      setPrice('');
    } catch (error) {
      console.error('Erro ao criar o produto:', error);
    }
  };

  return (
    <div>
      <h1>Products</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default Products;