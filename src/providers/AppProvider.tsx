import { useState, useContext, createContext,} from "react";

interface AppContextType {
  openDrawer: boolean;
  setOpenDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  return useContext(AppContext);
}

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <AppContext.Provider value={{ openDrawer, setOpenDrawer}}>
      {children}
    </AppContext.Provider>
  );
}
