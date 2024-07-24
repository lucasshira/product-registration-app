import { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from "../components/ui/use-toast";
import { Product } from '@/types/types';


const useProducts = (userSub: string | null) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      if (userSub) {
        try {
          setIsLoadingProducts(true);
          const response = await axios.get(`https://product-registration-app-api.onrender.com/api/products?sub=${userSub}`);
          const responseData: Product[] = response.data;
  
          setProducts(responseData);
        } catch (error) {
          setIsLoadingProducts(false);
          toast({ description: 'Erro ao carregar produtos' });
        } finally {
          setIsLoadingProducts(false);
        }
      }
    };
  
    fetchProducts();
  }, [userSub, toast]);

  const handleDeleteItem = async (productId: string) => {
    try {
      setDeletingProductId(productId);
      await axios.delete(`https://product-registration-app-api.onrender.com/api/products?sub=${userSub}&productId=${productId}`);
      setProducts(products.filter(product => product.productId !== productId));
    } catch (error) {
      toast({ description: "Erro ao excluir o produto" });
      setDeletingProductId(null);
    }
  };

  return { products, isLoadingProducts, deletingProductId, handleDeleteItem };
};

export default useProducts;