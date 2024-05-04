import { useState } from 'react';
import { Separator } from "@/components/ui/separator"
import GoogleLoginAuth from "./components/GoogleLoginAuth";
import Products from "./components/Products";
import NotLogged from './components/NotLogged';
import Loading from './components/Loading';

import DarkModeButton from './components/DarkModeButton';
import useAppData from './hook/useAppData';

export function App() {
  const [userSub, setUserSub] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  const { theme, changeTheme } = useAppData();

  const handleLoginSuccess = (sub: string) => {
    setUserSub(sub);
  };

  // useEffect(() => {
  //   const savedMode = localStorage.getItem('darkMode');
  //   if (savedMode) {
  //     setIsDarkMode(JSON.parse(savedMode));
  //   }
  // }, []);

  // const toggleDarkMode = () => {
  //   setIsDarkMode(prevMode => {
  //     const newMode = !prevMode;
  //     localStorage.setItem('darkMode', JSON.stringify(newMode));
  //     return newMode;
  //   });
  // };

  const validTheme = theme ?? '';
  const changeValidTheme = changeTheme ?? (() => {});

  return (
    <div className={`p-6 max-w-4xl mx-auto space-y-4 ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="flex flex-row-reverse justify-between">
        <GoogleLoginAuth setUserSub={handleLoginSuccess} setLoading={setLoading} />
        <DarkModeButton theme={validTheme} changeTheme={changeValidTheme} />
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