import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Search, PlusCircle, LucideClipboardX} from 'lucide-react';
import { Table, TableHead, TableHeader, TableBody, TableCell, TableRow } from "./components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogFooter, DialogHeader } from "./components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { DialogClose } from "@radix-ui/react-dialog";
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "./components/ui/use-toast";

import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from 'react';

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
  const { toast } = useToast();

  const formatID = (id: string) => {
    return id.substr(0, 8);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!productName || !productPrice) {
      toast({
        description: "Preencha todos os campos para prosseguir",
      })
      return;
    }

    const newProduct: Product = {
      id: uuidv4(),
      name: productName,
      price: productPrice
    };

    setProducts(prevProducts => {
      const updatedProducts = [...prevProducts, newProduct];
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      return updatedProducts;
    });

    setProductName('');
    setProductPrice('');
    setIsModalOpen(false);
  };

  const handleDeleteItem = (productId: string) => {
    setProducts(prevProducts => prevProducts.filter(product => productId !== product.id));
    const updatedProducts = products.filter(product => product.id !== productId);

    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold">Produtos</h1>

          <div className="flex items-center justify-between">
            <form className="flex items-center gap-2">
              <Input type="id" placeholder="ID do pedido" />
              <Input type="name" placeholder="Nome do produto" />
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
                      <Button type="submit" variant={"outline"}>Cancelar</Button>
                    </DialogClose>
                    <Button type="submit" onClick={() => setIsModalOpen(false)}>Salvar</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="border rounded-lg p-2">
          <Table>
            <TableHeader>
              <TableHead>ID</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Preço</TableHead>
            </TableHeader>
            <TableBody>
                {products.map(product => (
                  <TableRow key={product.id}>
                    <TableCell>{formatID(product.id)}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell className="flex justify-between">
                      R$: {product.price}
                      <LucideClipboardX className="cursor-pointer" onClick={() => handleDeleteItem(product.id)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
          </Table>
        <Toaster />
      </div>
    </div>
  )
}
