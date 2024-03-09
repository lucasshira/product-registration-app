import axios from 'axios';
import { useState, useEffect, ChangeEvent } from 'react';

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Search, PlusCircle, LucideClipboardX } from 'lucide-react';
import { Table, TableHead, TableHeader, TableBody, TableCell, TableRow } from "../components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogFooter, DialogHeader } from "../components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { DialogClose } from "@radix-ui/react-dialog";
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "../components/ui/use-toast";

// import { v4 as uuidv4 } from 'uuid';
import NenhumProduto from "../components/NenhumProduto";

interface Products {
  id: string
  name: string
  price: number
}

const Products = ({ userEmail }: { userId: string | null, userEmail: string | null }) => {
  // const [name, setName] = useState('');
  // const [price, setPrice] = useState('');
  const [products, setProducts] = useState<Products[]>([]);
  const [productName, setProductName] = useState<string>('');
  const [productPrice, setProductPrice] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [id, setId] = useState<string>('');
  const [nome, setNome] = useState<string>('');
  const [filteredProducts, setFilteredProducts] = useState<Products[]>([]);

  const { toast } = useToast();

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
    
  //   if (!userId) {
  //     console.error('ID do usuário não encontrado');
  //     return;
  //   }

  //   try {
  //     const response = await axios.post("http://localhost:3000/api/products", { name, price, userId });
  //     console.log("Novo produto criado:", response.data);
  //     // Limpar os campos do formulário após a criação do produto
  //     setName('');
  //     setPrice('');
  //   } catch (error) {
  //     console.error('Erro ao criar o produto:', error);
  //   }
  // };

  // const formatID = (id: string | undefined) => {
  //   if (id) {
  //     return id.substr(0, 8);
  //   }
  //   return "";
  // };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(userEmail);
    // id vindo corretamente
    
    if (!userEmail) {
      console.error('E-mail do usuário não encontrado');
      return;
    }
  
    try {
      // Chamada para adicionar um novo produto
      const response = await axios.post("http://localhost:3000/api/products", { name: productName, price: productPrice, email: userEmail });
      console.log("Novo produto criado:", response.data);

      // Atualize a lista de produtos após adicionar um novo produto
      setProducts(prevProducts => [...prevProducts, response.data]);
  
      // Limpar os campos do formulário após a criação do produto
      setProductName('');
      setProductPrice('');
    } catch (error) {
      console.error('Erro ao criar o produto:', error);
    }
  };

  const handleDeleteItem = async (productId: string) => {
    try {
      // Chamada para excluir o produto pelo ID
      await axios.delete(`http://localhost:3000/api/products/${productId}`);
  
      // Atualize a lista de produtos após a exclusão do produto
      const updatedProducts = products.filter(product => product.id !== productId);
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts); // Se necessário, atualize também os produtos filtrados
    } catch (error) {
      console.error('Erro ao excluir o produto:', error);
    }
  };

  const handleFilterProducts = async () => {
    if (!id && !nome) {
      toast({
        description: "ID e/ou nome de produto não encontrado(s)",
      });
      return;
    }
  
    try {
      // Chamada para filtrar produtos pelo ID e/ou nome
      const response = await axios.get(`http://localhost:3000/api/products?name=${nome}&id=${id}`);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error('Erro ao filtrar os produtos:', error);
    }
  };

  const handleChangeId = (e: ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  };

  const handleChangeNome = (e: ChangeEvent<HTMLInputElement>) => {
    setNome(e.target.value);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      if (userEmail) {
        try {
          const response = await axios.get(`http://localhost:3000/api/products/`);
          const responseData: Products[] = response.data; // Acessando os dados da resposta
  
          setProducts(responseData);
        } catch (error) {
          console.error('Erro ao buscar produtos:', error);
          toast({ description: 'Erro ao carregar produtos' });
        }
      }
    };
  
    fetchProducts();
  }, [userEmail, toast]);

//   return (
//     <div>
//       <h1>Products</h1>
//       <form onSubmit={handleSubmit}>
//         <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
//         <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" />
//         <button type="submit">Add Product</button>
//       </form>
//     </div>
//   );
// }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <form className="flex items-center gap-2">
                <Input type="id" placeholder="ID do pedido" onChange={handleChangeId} />
                <Input type="name" placeholder="Nome do produto" onChange={handleChangeNome} />
                <Button type="submit" variant={"link"} onClick={(e) => {e.preventDefault(); handleFilterProducts(); }}>
                  <Search className="w-4 h-4 mr-2" />
                  Filtar resultados
                </Button>
              </form>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="w-4 h-4 mr-2" />
                  Novo produto
                </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo produto</DialogTitle>
                  <DialogDescription>Criar um novo produto no sistema</DialogDescription>
                </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-4 items-center text-right gap-2">
                    <Label htmlFor="name">Produto</Label>
                    <Input className="col-span-3" id="name" value={productName} onChange={(e) => setProductName(e.target.value)} />
                  </div>

                  <div className="grid grid-cols-4 items-center text-right gap-2">
                    <Label htmlFor="price">Preço</Label>
                    <Input className="col-span-3" id="price" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} />
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="submit" variant={"outline"}>Cancelar</Button>
                    </DialogClose>
                    <Button type="submit" onClick={() => setIsModalOpen(true)}>Salvar</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="border rounded-lg p-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Preço</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(!products.length && !filteredProducts.length) ? (
                  <NenhumProduto />
                ) : (
                  filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                      <TableRow key={product.id}>
                        {/* <TableCell>{formatID(product.id)}</TableCell> */}
                        <TableCell>{product.name}</TableCell>
                        <TableCell className="flex justify-between">
                          R$: {product.price}
                          <LucideClipboardX className="cursor-pointer" onClick={() => handleDeleteItem(product.id)} />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                  products.map(product => (
                    <TableRow key={product.id}>
                      {/* <TableCell>{formatID(product.id)}</TableCell> */}
                      <TableCell>{product.name}</TableCell>
                      <TableCell className="flex justify-between">
                        R$: {product.price}
                        <LucideClipboardX className="cursor-pointer" onClick={() => handleDeleteItem(product.id)} />
                      </TableCell>
                    </TableRow>
                  ))
                )
              )}
            </TableBody>
          </Table>
        <Toaster />
      </div>
    </div>
  )
}

export default Products;