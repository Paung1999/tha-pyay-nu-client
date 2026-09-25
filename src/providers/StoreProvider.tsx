
import type { AppStore } from "../../src/app/store.ts";
import { makeStore } from "../app/store.ts";
import { setupListeners } from "@reduxjs/toolkit/query";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import { persistStore, type Persistor} from "redux-persist";


interface Props {
    readonly children: ReactNode;
}

export const StoreProvider = ({ children }: Props) => {
    const storeRef = useRef<AppStore | null>(null);
    const persistorRef = useRef<Persistor | null >(null);


    if (!storeRef.current) {
        // Create the store instance the first time this renders
        storeRef.current = makeStore();
        persistorRef.current = persistStore(storeRef.current);
    }

    useEffect(() => {
        if (storeRef.current != null) {
            // configure listeners using the provided defaults
            // optional, but required for `refetchOnFocus`/`refetchOnReconnect` behaviors
            const unsubscribe = setupListeners(storeRef.current.dispatch);
            return unsubscribe;
        }
    }, []);

    return <Provider store={storeRef.current}>
                <PersistGate loading={null} persistor={persistorRef.current!}>
                    {children}
                </PersistGate>
            </Provider>;
};
