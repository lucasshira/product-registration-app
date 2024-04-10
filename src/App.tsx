import { useState } from 'react';
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import GoogleLoginAuth from "./components/GoogleLoginAuth";
import Products from "./components/Products";
import NotLogged from './components/NotLogged';

export function App() {
  const [userSub, setUserSub] = useState<string | null>(null);

  const handleLoginSuccess = (sub: string) => {
    setUserSub(sub);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <div className="flex flex-row-reverse justify-between">
        <GoogleLoginAuth setUserSub={handleLoginSuccess} />
        <a href={'#'} className="text-4xl font-bold">Produtos</a>
      </div>
      <Separator />
      {!userSub ? (
        <NotLogged />
      ) : (
        <Products userSub={userSub} />
      )}
    </div>
  )
}
