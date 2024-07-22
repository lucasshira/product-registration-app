import { useEffect, useState } from 'react';
import useAppData from './hook/useAppData';

import GoogleLoginAuth from "./components/GoogleLoginAuth";
import Products from "./components/Products";
import { Separator } from "@/components/ui/separator";
import NotLogged from './components/NotLogged';
import Loading from './components/Loading';
import DarkModeButton from './components/DarkModeButton';

export function App() {
  const [userSub, setUserSub] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const { changeTheme } = useAppData();
  const changeValidTheme = changeTheme ?? (() => {});

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

  useEffect(() => {
    const savedUserSub = localStorage.getItem('userSub');
    if (savedUserSub !== null) {
      setUserSub(savedUserSub);
    }
    setInitialLoading(false);
  }, []);

  useEffect(() => {
    if (userSub) {
      localStorage.setItem('userSub', userSub);
    } else {
      localStorage.removeItem('userSub');
    }
  }, [userSub]);

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
          <GoogleLoginAuth setUserSub={setUserSub} setLoading={setLoading} />
          <DarkModeButton theme={isDarkMode ? 'dark' : ''} changeTheme={toggleDarkMode} />
          <a href={'#'} className="text-4xl font-bold">Produtos</a>
        </div>
        <Separator />
        {initialLoading ? (
          <Loading darkMode={isDarkMode ? false : true} size={2} />
        ) : (
          userSub ? (
            <div>
              {loading ? (
                <div className="text-center">Carregando produtos...</div>
              ) : (
                <Products userSub={userSub} setLoading={setLoading} />
              )}
            </div>
          ) : (
            <NotLogged />
          )
        )}
      </div>
    </div>
  );
}