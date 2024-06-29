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
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "../components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

import { getCurrentDayMonth } from '../backend/models/ProductModel';
import NenhumProduto from "../components/NenhumProduto";
import Loading from '../components/Loading';
import Pagination from '../components/Pagination';

interface Products {
  productId: string;
  name: string;
  price: number;
  date: string;
}

const Products = ({ userSub }: { userSub: string | null }) => {
  const [products, setProducts] = useState<Products[]>([]);
  const [productName, setProductName] = useState<string>('');
  const [productPrice, setProductPrice] = useState<string>('');
  const [, setName] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filteredProducts, setFilteredProducts] = useState<Products[]>([]);
  const [notFound, setNotFound] = useState<boolean>(false);

  const { toast } = useToast();

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!userSub) {
      toast({
        description: "Faça login para adicionar novos produtos na tabela"
      });
      setIsModalOpen(false);
      return;
    }

    if (isNaN(parseFloat(productPrice))) {
      toast({
        description: "O preço do produto precisa ser um número válido",
      });
      return;
    }

    if (parseFloat(productPrice) <= 0) {
      toast({
        description: "O preço do produto precisa ser maior que 0"
      });
      return;
    }

    if (productName.trim() === '') {
      toast({
        description: "Insira um nome no produto para prosseguir"
      });
      return;
    }

    if (productName.length >= 90) {
      toast({
        description: "Ocorreu um erro ao adicionar o produto"
      });
      return;
    }
  
    try {
      setIsLoading(true);
      const currentDate = getCurrentDayMonth();
      const response = await axios.post("http://localhost:3000/api/products", { name: productName, price: parseFloat(productPrice), date: currentDate, sub: userSub });

      setProducts(prevProducts => {
        const updatedProducts = [...prevProducts, response.data];
        const totalPages = Math.ceil(updatedProducts.length / itemsPerPage);

        if (updatedProducts.length > prevProducts.length && totalPages > currentPage) {
          setCurrentPage(totalPages);
        }

        return updatedProducts;
      });
  
      setProductName('');
      setProductPrice('');
      toast({
        description: "Produto adicionado com sucesso!"
      });
      setIsModalOpen(false);
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao criar o produto:', error);
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (productId: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/products?sub=${userSub}&productId=${productId}`);
  
      const updatedProducts = products.filter(product => product.productId !== productId);
      setProducts(updatedProducts);
      setFilteredProducts([]);

      const totalPagesAfterDeletion = Math.ceil(updatedProducts.length / itemsPerPage);
      if (currentPage > totalPagesAfterDeletion) {
        setCurrentPage(totalPagesAfterDeletion);
      }

      if (currentPage <= 1) setCurrentPage(1);
    } catch (error) {
      console.error('Erro ao excluir o produto:', error);
    }
  };

  const handleChangeNome = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    setTimeout(() => {
      handleFilterProducts(value);
    }, 200);
  };

  const handlePriceChange = (e: any) => {
    let value = e.target.value.replace(/\D/g, '');
    setProductPrice(value);
  };

  const formattedPrice = (value: any) => {
    if (!value) return '';
    return (parseInt(value) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleFilterProducts = async (name: string) => {
    if (!name) {
      setFilteredProducts([]);
      setNotFound(false);
      return;
    }
  
    try {
      const response = await axios.get(`http://localhost:3000/api/products?sub=${userSub}&name=${name}`);
  
      const filteredProducts = response.data.filter((product: any) => {
        return product.name.toLowerCase().includes(name.toLowerCase());
      });

      if (filteredProducts.length === 0) {
        if (!notFound) {
          toast({
            description: "Produto não encontrado na base de dados"
          });
          setNotFound(true);
        }
      } else {
        setNotFound(false);
      }

      setFilteredProducts(filteredProducts);
    } catch (error) {
      console.error('Erro ao filtrar os produtos: ', error);
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

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const currentProducts = filteredProducts.length > 0 ? filteredProducts : products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <form className="flex items-center gap-2" onSubmit={(e) => { e.preventDefault() }}>
          <Input type="name" placeholder="Nome do produto" onChange={handleChangeNome} />
          <Button type="submit" variant={"link"}>
            <Search className="w-4 h-4 mr-2" />
            Filtar resultados
          </Button>
        </form>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="size-4 mr-2" />
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
                <Input className="col-span-3" id="price" value={formattedPrice(productPrice)} onChange={handlePriceChange} />
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant={"outline"}>Cancelar</Button>
                </DialogClose>
                <Button type="submit">
                  {isLoading ? <Loading size={1} /> : "Salvar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg p-2">
      {(!products.length && !filteredProducts.length) ? (
          <div className="flex items-center justify-center h-12">
            <NenhumProduto />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map(product => (
                        <TableRow key={product.productId}>
                          <TableCell>{product.productId}</TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{formattedPrice(product.price)}</TableCell>
                          <TableCell>{product.date}</TableCell>
                          <TableCell className="flex justify-end">
                            <Trash2 className="cursor-pointer" onClick={() => handleDeleteItem(product.productId)} />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      currentProducts.map(product => (
                        <TableRow key={product.productId}>
                          <TableCell>{product.productId}</TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{formattedPrice(product.price)}</TableCell>
                          <TableCell>{product.date}</TableCell>
                          <TableCell className="flex justify-end">
                            <Trash2 className="cursor-pointer justify-end" onClick={() => handleDeleteItem(product.productId)} />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                {totalPages > 1 && (
                <>
                  <Separator className="mt-2" />
                  <div className="flex justify-center mt-2">
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                  </div>
                </>
              )}
            </>
          )}
        <Toaster />
      </div>
    </div>
  );
}

export default Products;
