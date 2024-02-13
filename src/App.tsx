import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Search, PlusCircle } from 'lucide-react';
import { Table, TableHead, TableHeader, TableBody, TableCell, TableRow } from "./components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogFooter, DialogHeader } from "./components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { DialogClose } from "@radix-ui/react-dialog";

export function App() {
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

            <Dialog>
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

                <form className="space-y-6">
                  <div className="grid grid-cols-4 items-center text-right gap-2">
                    <Label htmlFor="name">Produto</Label>
                    <Input className="col-span-3" id="name" />
                  </div>

                  <div className="grid grid-cols-4 items-center text-right gap-2">
                    <Label htmlFor="price">Preço</Label>
                    <Input className="col-span-3" id="price" />
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="submit" variant={"outline"}>Cancelar</Button>
                    </DialogClose>
                    <Button type="submit">Salvar</Button>
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
              {Array.from({ length: 10 }).map((_, i) => {
                return (
                  <TableRow key={i}>
                  <TableCell>1982731892</TableCell>
                  <TableCell>Produto {i}</TableCell>
                  <TableCell>R$ 192,00</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
