import { useState } from 'react';
import { Separator } from "@/components/ui/separator"
import GoogleLoginAuth from "./components/GoogleLoginAuth";
import Products from "./components/Products";
import NotLogged from './components/NotLogged';
import Loading from './components/Loading';

export function App() {
  const [userSub, setUserSub] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleLoginSuccess = (sub: string) => {
    setUserSub(sub);
    setLoading(false);
  }

  useEffect(() => {
    if (loading && userSub === null) {
      setLoading(true);
    }
  }, [loading, userSub])

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <div className="flex flex-row-reverse justify-between">
        <GoogleLoginAuth setUserSub={handleLoginSuccess} />
        <a href={'#'} className="text-4xl font-bold">Produtos</a>
      </div>
      <Separator />
      {loading ? (
        <Loading size={2} />
      ) : (
        userSub ? <Products userSub={userSub} /> : <NotLogged />
      )}
    </div>
  )
}
