import type { Action, ThunkAction  } from "@reduxjs/toolkit";
import {combineSlices, configureStore} from "@reduxjs/toolkit";
import {cartSlice} from "./../libs/features/cartSlice.ts";
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

const rootReducer = combineSlices(cartSlice);
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
            }),
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