import { Outlet } from "react-router-dom";
import AppDrawer from "./components/AppDrawer";
import Header from "./components/Header";
import CartDrawer from "./components/CartDrawer";



export default function App(){
  

  return(
    <div>
      <header className="sticky top-0 z-50 bg-[#0f172a] shadow-md border-b border-slate-800">
   
      <Header/>
</header>
      <div className="flex flex-row flex-1 overflow-hidden">
        <AppDrawer />
        <CartDrawer/>
        <div className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </div>
      </div>
    </div>
  )
}