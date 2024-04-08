import { useEffect, useState } from 'react';
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import GoogleLoginAuth from "./components/GoogleLoginAuth";
import Products from "./components/Products";
import NotLogged from './components/NotLogged';

export function App() {
  const [userSub, setUserSub] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLoginSuccess = (sub: string) => {
    setUserSub(sub);
    setIsLoading(true);
  }

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => setIsLoading(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoading])
  
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <div className="flex flex-row-reverse justify-between">
        <GoogleLoginAuth setUserSub={handleLoginSuccess} />
        <a href={'#'} className="text-4xl font-bold">Produtos</a>
      </div>
      <Separator />
      {isLoading ? (
        <Progress value={100} className="w-[50%] mx-auto block" style={{ marginTop: '60px' }} />
      ) : (
        <>
          {!userSub ? (
            <NotLogged />
          ) : (
            <Products userSub={userSub} />
          )}
        </>
      )}
    </div>
  )
}