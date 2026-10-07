import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, Book } from '../../../global/types.ts';

interface CartState {
    cartItems: CartItem[];
    isOpen: boolean;
}
const initialState: CartState = {
    cartItems: [],
    isOpen: false,
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers:(create) => ({
        addToCart: create.reducer((state,action:PayloadAction<Book>)=>{
            const existingItem = state.cartItems.find((item)=> item.sellBookId == action.payload.id);
            if(existingItem){
                existingItem.quantity += 1 //immer let you mutate
            }else{
                state.cartItems.push({
                    sellBookId: action.payload.id,
                    title: action.payload.book.title,
                    author: action.payload.book.author,
                    price: action.payload.price,
                    currency:action.payload.currency,
                    coverImage: action.payload.book.coverImage,
                    quantity: 1
                })
            }
        }),
        removeFromCart:create.reducer((state,action:PayloadAction<number>)=>{
            state.cartItems = state.cartItems.filter(item => item.sellBookId !== action.payload)
        }),
        increaseQuantity:create.reducer((state, action:PayloadAction<number>)=>{
            const existingItem = state.cartItems.find((item)=> item.sellBookId == action.payload);
            if(existingItem){
                existingItem.quantity += 1
            }
        }),
        decreaseQuantity:create.reducer((state, action:PayloadAction<number>)=>{
            const existingItem = state.cartItems.find((item)=>item.sellBookId == action.payload);
            if(existingItem){
                if(existingItem.quantity>1){
                    existingItem.quantity -= 1
                }
                else{
                    state.cartItems.filter((item)=> item.sellBookId !== action.payload)
                }
            }
        }),
        clearCart:create.reducer((state)=>{
            state.cartItems=[]
        }),
        openCart:create.reducer((state) => {
            state.isOpen= true
        }),
        closeCart:create.reducer((state) => {
            state.isOpen = false
        }),
        toggleCart: create.reducer((state) => {
            state.isOpen = !state.isOpen
        })
    }),
    selectors:{
        selectCartItem: (state) => state.cartItems,
        selectCartItemCount : (state) => state.cartItems.reduce((count,item)=> count + item.quantity,0),
        selectCartTotal: (state) => state.cartItems.reduce((total,item)=>total + item.quantity* item.price,0),
        selectIsCartOpen: (state) => state.isOpen
    }

});
export const {addToCart, removeFromCart,increaseQuantity,decreaseQuantity, clearCart, toggleCart, openCart,closeCart} = cartSlice.actions;
export const {selectCartItem, selectCartItemCount, selectCartTotal, selectIsCartOpen} = cartSlice.selectors;