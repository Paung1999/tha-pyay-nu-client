import type { CartItem } from "../global/types";

export type CartAction = 
    | {type: 'ADD_TO_CART', payload: CartItem}
    | {type: 'REMOVE_FROM_CART', payload: CartItem}
    | {type: 'UPDATE_QUANTITY', payload: {sellBookId: number, quantity: number}}
    | {type: 'CLEAR_CART'}


export type CartState = {
    items: CartItem[];
}

export function cartReducer(state: CartState, action: CartAction) {
    switch(action.type) {
        case 'ADD_TO_CART': {
            const itemToAdd = action.payload;
            const existingItemIndex = state.items.findIndex(item => item.sellBookId === itemToAdd.sellBookId);

            if(existingItemIndex > -1){
                const updatedItems = state.items.map((item, index)=>
                    index === existingItemIndex ? {...item, quantity: item.quantity + 1} : item
                
                );
                return {...state, items: updatedItems};
            
            }else{
                const newItems = [...state.items, {...itemToAdd, quantity: itemToAdd.quantity}];
                return {...state, items: newItems};
            
            }
        }

        case 'REMOVE_FROM_CART': {
            const itemToRemove = action.payload;
            const updatedItems = state.items.filter(item => item.sellBookId !== itemToRemove.sellBookId);
            return {
                ...state,
                items: updatedItems,
            
            };
        }

        case 'UPDATE_QUANTITY':{
            const { sellBookId , quantity} = action.payload;

             if (quantity < 1) {
                const filteredItems = state.items.filter(item => item.sellBookId !== sellBookId);
                return { ...state, items: filteredItems };
            }
            const updatedItems = state.items.map(item =>
                item.sellBookId === sellBookId ? { ...item, quantity: quantity } : item
            );
            return { ...state, items: updatedItems };
        }
        
        case 'CLEAR_CART': {
            return {...state, items: []}
        }

        default:
            return state;
    
    }
}