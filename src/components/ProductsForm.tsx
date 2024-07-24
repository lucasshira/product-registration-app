import { useState } from 'react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogFooter, DialogHeader } from "../components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { DialogClose } from "@radix-ui/react-dialog";
import Loading from '../components/Loading';

interface ProductsFormProps {
  userSub: string | null;
  onSubmit?: (name: string, price: number) => void | undefined;
  isLoading: boolean;
}

const ProductsForm = ({ onSubmit, isLoading }: ProductsFormProps) => {
  const [productName, setProductName] = useState<string>('');
  const [productPrice, setProductPrice] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) onSubmit(productName, parseFloat(productPrice));
    setIsModalOpen(false);
    setProductName('');
    setProductPrice('');
  };

  const handlePriceChange = (e: any) => {
    let value = e.target.value.replace(/\D/g, '');
    setProductPrice(value);
  };

  const formattedPrice = (value: any) => {
    if (!value) return '';
    return (parseInt(value) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button>
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
  );
};

export default ProductsForm;