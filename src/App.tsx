import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Search, PlusCircle, LucideClipboardX } from 'lucide-react';
import { Table, TableHead, TableHeader, TableBody, TableCell, TableRow } from "./components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogFooter, DialogHeader } from "./components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { DialogClose } from "@radix-ui/react-dialog";
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "./components/ui/use-toast";

import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect, ChangeEvent } from 'react';
import NenhumProduto from "./components/NenhumProduto";

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
    setFilteredProducts(prevFilteredProducts => prevFilteredProducts.filter(product => productId !== product.id))
    const updatedProducts = products.filter(product => product.id !== productId);

    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const handleFilterProducts = () => {
    if (!id && !nome) {
      toast({
        description: "ID e/ou nome de produto nao encontrado(s)",
      })
      return;
    }

    const filtered = products.filter(product => {
      const idMatch = id ? product.id.includes(id) : true;
      const nomeMatch = nome ? product.name.toLocaleLowerCase().includes(nome.toLocaleLowerCase()) : true;

      return idMatch && nomeMatch;
    });

    if (filtered.length === 0) {
      toast({
        description: "Nenhum produto encontrado com os critérios de busca informados"
      });
    }

    setFilteredProducts(filtered);
  };

  const handleChangeId = (e: ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  };

  const handleChangeNome = (e: ChangeEvent<HTMLInputElement>) => {
    setNome(e.target.value);
  };

  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <a href={'/'} className="text-3xl font-bold">Produtos</a>

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
