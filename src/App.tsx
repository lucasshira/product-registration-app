import { useState } from 'react';
import { Separator } from "@/components/ui/separator"
import GoogleLoginAuth from "./components/GoogleLoginAuth";
import Products from "./components/Products";

export function App() {
  const [userSub, setUserSub] = useState<string | null>(null);
  
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">

        <div className="flex flex-row-reverse justify-between">
          <GoogleLoginAuth setUserSub={setUserSub} />
          <a href={'#'} className="text-4xl font-bold">Produtos</a>
        </div>
        <Separator />
        <Products userSub={userSub} />
      </div>
  )
}
