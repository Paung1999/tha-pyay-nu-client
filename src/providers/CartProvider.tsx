
import { createContext, useContext, useReducer, useMemo, useEffect, useState } from "react";
import { cartReducer,type CartState, type CartAction } from "../hooks/cartReducer"

type CartContextType = CartState & {
    dispatch: React.Dispatch<CartAction>;
    isCartOpen: boolean;
    setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const cartContext = createContext<CartContextType | null>(null);

const initialState: CartState= { items: []};

const initCart = (initialState: CartState)=> {
    try{
        const storedCart = localStorage.getItem("thapyaynu_cart");
        if(!storedCart) return initialState;
        return JSON.parse(storedCart);

    }catch(err){
        console.error("Failed to parse cart from local storage", err);
    }
    return initialState;
}

export default function CartProvider({children}: {children: React.ReactNode}){
    const [state, dispatch] = useReducer(cartReducer, initialState, initCart);
    const [ isCartOpen , setIsCartOpen ] = useState(false);

    useEffect(()=> {
        localStorage.setItem("thapyaynu_cart", JSON.stringify(state));
    }, [state])

    const value = useMemo(()=> {
        return{
            ...state,
            dispatch,
        
        }
    },[state, dispatch]);

    return (
        <cartContext.Provider value={{...value, isCartOpen, setIsCartOpen}}>
            {children}
        </cartContext.Provider>
    )
}

export function useCart(){
    return useContext(cartContext);
}