import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";


export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8800/api/v1',
        credentials: "include",
    }),
    tagTypes: ['Book', 'Genre','Order', 'listing', 'MyOrders', 'SpecificOrder'],
    endpoints: () => ({})
});
