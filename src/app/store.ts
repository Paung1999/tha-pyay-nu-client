import type { Action, ThunkAction  } from "@reduxjs/toolkit";
import {combineSlices, configureStore} from "@reduxjs/toolkit";
import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER

} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import {cartSlice} from "../libs/features/cart/cartSlice.ts";
import {apiSlice} from "../libs/features/api/apiSlice.ts";
import {authSlice} from "../libs/features/auth/authSlice.ts";

const authPersistConfig = {
    key: 'auth',
    storage,
    blacklist: ['isInitialized'],
}

const rootReducer = combineSlices(
    cartSlice,
    apiSlice,
    {auth:persistReducer(authPersistConfig, authSlice.reducer)});

export type RootState = ReturnType<typeof rootReducer>;

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['cart'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = ()=>{
    return configureStore({
        reducer: persistedReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: [FLUSH, REHYDRATE, PERSIST, PURGE, REGISTER, PAUSE],
                },
            }).concat(apiSlice.middleware),
    });
};

// Infer the return type of `makeStore`
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
    ThunkReturnType,
    RootState,
    unknown,
    Action
>;