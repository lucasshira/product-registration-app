import { createContext, useState } from "react";

type Theme = 'dark' | ''

interface AppContextProps {
  theme?: Theme | null
  changeTheme?: () => void
}

const AppContext = createContext<AppContextProps>({})

export function AppProvider(props: any) {
  const [theme, setTheme] = useState<Theme>('dark');

  const changeTheme = () => {
    setTheme(theme === '' ? 'dark' : '');
  }

  return (
    <AppContext.Provider value={{
      theme,
      changeTheme
    }}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppContext;