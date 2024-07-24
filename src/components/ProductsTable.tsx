import { Table, TableHead, TableHeader, TableBody, TableCell, TableRow } from "../components/ui/table";
import { Trash2 } from 'lucide-react';
import Loading from '../components/Loading';
import NenhumProduto from "./NenhumProduto";
import { Product } from "@/types/types";

interface ProductsTableProps {
  products: Product[];
  filteredProducts?: Product[];
  deletingProductId: string | null;
  handleDeleteItem: (productId: string) => void;
  formattedPrice?: (value: any) => string;
  isLoadingProducts: boolean;
}

const ProductsTable = ({ products, filteredProducts, deletingProductId, handleDeleteItem, formattedPrice, isLoadingProducts }: ProductsTableProps) => {
  if (isLoadingProducts) {
    return (
      <div className="flex items-center justify-center h-12">
        <Loading size={1} />
      </div>
    );
  }

  if (!products.length && !filteredProducts?.length) {
    return (
      <div className="flex items-center justify-center h-12">
        <NenhumProduto />
      </div>
    );
  }

  const currentProducts = filteredProducts!.length > 0 ? filteredProducts : products;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Produto</TableHead>
          <TableHead>Preço</TableHead>
          <TableHead>Data</TableHead>
          <TableHead> </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {currentProducts?.map(product => (
          <TableRow key={product.productId}>
            <TableCell>{product.productId}</TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>{formattedPrice!(product.price)}</TableCell>
            <TableCell>{product.date}</TableCell>
            <TableCell className="flex justify-end items-center relative">
              {deletingProductId === product.productId ? (
                <div className="flex items-center justify-center w-6 h-6">
                  <Loading size={1} />
                </div>
              ) : (
                <Trash2
                  className="cursor-pointer transform transition-transform duration-300 hover:scale-110"
                  onClick={() => handleDeleteItem(product.productId)}
                />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProductsTable;