import { useState, ChangeEvent } from 'react';
import ProductsForm from './ProductsForm';
import ProductsTable from './ProductsTable';
import useProducts from '../hook/useProducts';
import Pagination from '../components/Pagination';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Search } from 'lucide-react';
import { Toaster } from "@/components/ui/toaster";
import { Separator } from "@/components/ui/separator";
import axios from 'axios';
import { toast } from './ui/use-toast';
import { Product } from '@/types/types';

const Products = ({ userSub }: { userSub: string | null }) => {
  const { products, isLoadingProducts, deletingProductId, handleDeleteItem } = useProducts(userSub);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleFilterProducts = async (name: string) => {
    if (!name) {
      setFilteredProducts([]);
      setNotFound(false);
      return;
    }

    try {
      const response = await axios.get(`https://product-registration-app-api.onrender.com/api/products?sub=${userSub}&name=${name}`);
      const filteredProducts = response.data.filter((product: any) => product.name.toLowerCase().includes(name.toLowerCase()));

      if (filteredProducts.length === 0) {
        if (!notFound) {
          toast({ description: "Produto não encontrado na base de dados" });
          setNotFound(true);
        }
      } else {
        setNotFound(false);
      }

      setFilteredProducts(filteredProducts);
    } catch (error) {
      toast({ description: "Erro inesperado ao filtrar produto" });
    }
  };

  const handleChangeNome = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    
    const newTimeout = setTimeout(() => {
      handleFilterProducts(value);
    }, 500);
    
    setDebounceTimeout(newTimeout);
  };

  const currentProducts = filteredProducts.length > 0 ? filteredProducts : products;
  const paginatedProducts = currentProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex flex-col gap-6">
      <Toaster />
      <ProductsForm userSub={userSub} isLoading={isLoadingProducts} />
      <div className="flex items-center gap-4">
        <Input
          placeholder="Filtrar por nome"
          onChange={handleChangeNome}
          className="w-full"
        />
        <Button
          onClick={() => handleFilterProducts('')}
          variant="outline"
        >
          <Search size={16} />
        </Button>
      </div>
      <ProductsTable
        products={paginatedProducts}
        deletingProductId={deletingProductId}
        handleDeleteItem={handleDeleteItem}
        isLoadingProducts={isLoadingProducts}
      />
      {currentProducts.length > itemsPerPage && (
        <>
          <Separator className="mt-2" />
          <Pagination
            totalPages={currentProducts.length}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}

export default Products;