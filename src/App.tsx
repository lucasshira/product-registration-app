import { useEffect, useState } from 'react';
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
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  const { changeTheme } = useAppData();
  
  const changeValidTheme = changeTheme ?? (() => {});

  const handleLoginSuccess = (sub: string) => {
    setUserSub(sub);
  };

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      setIsDarkMode(JSON.parse(savedMode));
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('dark');
    } else {
      document.body.classList.add('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
    changeValidTheme();
  };

  return (
    <div className="min-h-screen">
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <div className="flex flex-row-reverse justify-between items-center">
          <GoogleLoginAuth setUserSub={handleLoginSuccess} setLoading={setLoading} />
          <DarkModeButton theme={isDarkMode ? 'dark' : ''} changeTheme={toggleDarkMode} />
          <a href={'#'} className="text-4xl font-bold">Produtos</a>
        </div>
        <Separator />
        {loading ? (
          <Loading darkMode={isDarkMode ? false : true} size={2} />
        ) : (
          userSub ? <Products userSub={userSub} /> : <NotLogged />
        )}
      </div>
    </div>
  );
}