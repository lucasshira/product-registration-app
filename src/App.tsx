import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Search, PlusCircle, LucideClipboardX } from 'lucide-react';
import { Table, TableHead, TableHeader, TableBody, TableCell, TableRow } from "./components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator"
import { DialogFooter, DialogHeader } from "./components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { DialogClose } from "@radix-ui/react-dialog";
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "./components/ui/use-toast";
import axios from 'axios';

// import { v4 as uuidv4 } from 'uuid';
import { useState, ChangeEvent } from 'react';
import NenhumProduto from "./components/NenhumProduto";
// import GoogleAuth from "./components/GoogleAuth";
import GoogleLoginAuth from "./components/GoogleLoginAuth";
import Products from "./components/Products";

interface Product {
  id: string;
  name: string;
  price: string;
}

export function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productName, setProductName] = useState<string>('');
  const [productPrice, setProductPrice] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [id, setId] = useState<string>('');
  const [nome, setNome] = useState<string>('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const { toast } = useToast();

  const formatID = (id: string | undefined) => {
    if (id) {
      return id.substr(0, 8);
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!userId) {
      console.error('ID do usuário não encontrado');
      return;
    }
  
    try {
      // Chamada para adicionar um novo produto
      const response = await axios.post("http://localhost:3000/api/products", { name: productName, price: productPrice, userId });
      console.log("Novo produto criado:", response.data);
  
      // Atualize a lista de produtos após adicionar um novo produto
      const updatedProducts = [...products, response.data];
      setProducts(updatedProducts);
  
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

  // useEffect(() => {
  //   // Não será mais necessário recuperar produtos do localStorage
  //   // A lista de produtos será obtida diretamente do MongoDB
  //   // Você pode adicionar uma chamada para a API aqui, se necessário
  // }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">

        <div className="flex flex-row-reverse justify-between">
          <GoogleLoginAuth setUserId={setUserId} />
          <a href={'/'} className="text-4xl font-bold">Produtos</a>
        </div>
        <Separator />

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
                      <TableCell>{formatID(product.id)}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell className="flex justify-between">
                        R$: {product.price}
                        <LucideClipboardX className="cursor-pointer" onClick={() => handleDeleteItem(product.id)} />
                        <Products key={product.id} userId={userId} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  products.map(product => (
                    <TableRow key={product.id}>
                      <TableCell>{formatID(product.id)}</TableCell>
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
