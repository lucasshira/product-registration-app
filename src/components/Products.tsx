import axios from 'axios';
import { useState, useEffect, ChangeEvent } from 'react';

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Search, PlusCircle, Trash2 } from 'lucide-react';
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
  productId: string
  name: string
  price: number
}

const Products = ({ userSub }: { userSub: string | null }) => {
  // const [name, setName] = useState('');
  // const [price, setPrice] = useState('');
  const [products, setProducts] = useState<Products[]>([]);
  const [productName, setProductName] = useState<string>('');
  const [productPrice, setProductPrice] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [productId, setProductId] = useState<string>('');
  const [name, setName] = useState<string>('');
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
    console.log(userSub);
    // id vindo corretamente
    
    if (!userSub) {
      toast({
        description: "Faça login para adicionar novos produtos na tabela"
      })
      setIsModalOpen(false);
      return;
    }

    if (isNaN(parseFloat(productPrice))) {
      toast({
        description: "O preço do produto precisa ser um número valido",
      });
      return;
    }
  
    try {
      // Chamada para adicionar um novo produto
      const response = await axios.post("http://localhost:3000/api/products", { name: productName, price: parseFloat(productPrice), sub: userSub });
      console.log("Novo produto criado:", response.data);

      // Atualize a lista de produtos após adicionar um novo produto
      setProducts(prevProducts => [...prevProducts, response.data]);
  
      // Limpar os campos do formulário após a criação do produto
      setProductName('');
      setProductPrice('');
      toast({
        description: "Produto adicionado com sucesso!"
      })
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao criar o produto:', error);
    }
  };

  const handleDeleteItem = async (productId: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/products?sub=${userSub}&productId=${productId}`);
  
      const updatedProducts = products.filter(product => product.productId !== productId);
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
    } catch (error) {
      console.error('Erro ao excluir o produto:', error);
    }
  };

  const handleChangeId = (e: ChangeEvent<HTMLInputElement>) => {
    setProductId(e.target.value);
  };

  const handleChangeNome = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleFilterProducts = async (name: string) => {
    if (!name) {
      setFilteredProducts([]);
      return;
    }
  
    try {
      console.log("Enviando requisição para filtrar produtos:", { name, productId });
      // Chamada para filtrar produtos pelo ID e/ou nome
      const response = await axios.get(`http://localhost:3000/api/products?sub=${userSub}&name=${name}`);

      console.log("Resposta da API:", response.data);
  
      const filteredProducts = response.data.filter((product: any) => {
        return product.name.toLowerCase().includes(name.toLowerCase()); // Verifica se o nome do produto contém a string fornecida
      });

      console.log("Produtos filtrados:", filteredProducts);

      setFilteredProducts(filteredProducts);
      console.log(filteredProducts);
    } catch (error) {
      console.error('Erro ao filtrar os produtos:', error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      if (userSub) {
        try {
          const response = await axios.get(`http://localhost:3000/api/products?sub=${userSub}`);
          const responseData: Products[] = response.data;
  
          setProducts(responseData);
        } catch (error) {
          console.error('Erro ao buscar produtos:', error);
          toast({ description: 'Erro ao carregar produtos' });
        }
      }
    };
  
    fetchProducts();
  }, [userSub, toast]);

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
            <form className="flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); handleFilterProducts(name); }}>
              <Input type="id" placeholder="ID do pedido" onChange={handleChangeId} />
              <Input type="name" placeholder="Nome do produto" onChange={handleChangeNome} />
              <Button type="submit" variant={"link"}>
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
                      <Button type="button" variant={"outline"}>Cancelar</Button>
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
                      <TableRow key={product.productId.slice(0, 8)}>
                        <TableCell>{product.productId.slice(0, 8)}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell className="flex justify-between">
                          R$: {product.price}
                          <Trash2 className="cursor-pointer" onClick={() => handleDeleteItem(product.productId)} />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                  products.map(product => (
                    <TableRow key={product.productId}>
                        <TableCell>{product.productId.slice(0, 8)}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell className="flex justify-between">
                        R$: {product.price}
                        <Trash2 className="cursor-pointer" onClick={() => handleDeleteItem(product.productId)} />
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