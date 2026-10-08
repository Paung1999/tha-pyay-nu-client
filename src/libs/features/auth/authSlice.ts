import type {User} from "../../../global/types.ts";
import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

export interface AuthState{
    user: User | null,
    isAuthenticated: boolean,
    isInitialized: boolean,
}

export const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isInitialized: false,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action:PayloadAction<User>) => {
            state.user = action.payload
            state.isAuthenticated = true;
            state.isInitialized = true
        },
        logoutAction: (state) => {
            state.user = null
            state.isAuthenticated = false
        },
        setAuthInitialized:(state)=>{
            state.isInitialized= true
        }

    },
    selectors: {
        selectUser: (state) => state.user,
        selectIsAuthenticated: (state) => state.isAuthenticated,
        selectAuthInitialized: (state) => state.isInitialized,
    }
});

export const {setCredentials, logoutAction, setAuthInitialized} = authSlice.actions;
export const {selectUser, selectIsAuthenticated, selectAuthInitialized} = authSlice.selectors;