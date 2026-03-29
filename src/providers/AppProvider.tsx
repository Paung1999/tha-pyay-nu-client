import { useState, useContext, createContext, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AppContextType {
  openDrawer: boolean;
  setOpenDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  auth: User | null;
  setAuth: React.Dispatch<React.SetStateAction<User| null>>;
  adminAuth: User | null;
  setAdminAuth: React.Dispatch<React.SetStateAction<User | null>>;
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
  const [auth, setAuth] = useState<User | null>(null);
  const [adminAuth, setAdminAuth] = useState<User | null>(null);


  useEffect(() => {
    //Customer verification
    const verifyUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const verifyRes = await fetch(
          `http://localhost:8800/api/v1/user/verify`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (verifyRes.ok) {
          const user = await verifyRes.json();
          setAuth(user);
        } else {
          localStorage.removeItem("token");
          setAuth(null);
        }
      } catch (err) {
        console.log("Failed to verify user");
      }
    };
    verifyUser();
  }, []);

  useEffect(()=> {
    const verifyAdmin = async()=> {
      const token = localStorage.getItem("token");
      if(!token) return;
      try{
        const verifyRes = await fetch(`http://localhost:8800/api/v1/admin/verify`,{
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          
          }
        });
        if(verifyRes.ok){
          const user = await verifyRes.json();
          setAdminAuth(user);
        }else{
          localStorage.removeItem("token");
          setAdminAuth(null);
        }
        

      }catch(err){
        console.log("Failed to verify admin")
      }
    };
    verifyAdmin();

  },[]);

  return (
    <AppContext.Provider value={{ openDrawer, setOpenDrawer, auth, setAuth, adminAuth, setAdminAuth}}>
      {children}
    </AppContext.Provider>
  );
}
