import { useEffect, useState } from 'react';
import useAppData from './hook/useAppData';
import { useAuth } from './context/AuthContext';
import GoogleLoginAuth from "./components/GoogleLoginAuth";
import Products from "./components/Products";
import { Separator } from "@/components/ui/separator";
import NotLogged from './components/NotLogged';
import Loading from './components/Loading';
import DarkModeButton from './components/DarkModeButton';

export function App() {
  const { user, isLoading: authLoading } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  const { changeTheme } = useAppData();
  const changeValidTheme = changeTheme ?? (() => {});

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      setIsDarkMode(JSON.parse(savedMode));
    }
    setInitialLoading(false);
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
          <GoogleLoginAuth />
          <DarkModeButton theme={isDarkMode ? 'dark' : ''} changeTheme={toggleDarkMode} />
          <a href={'#'} className="text-4xl font-bold">Produtos</a>
        </div>
        <Separator />
        {initialLoading || authLoading ? (
          <Loading darkMode={isDarkMode ? false : true} size={2} />
        ) : (
          user ? <Products userSub={user.sub} /> : <NotLogged />
        )}
      </div>
    </div>
  );
}