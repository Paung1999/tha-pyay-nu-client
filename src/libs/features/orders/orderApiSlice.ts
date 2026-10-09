import {apiSlice} from "../api/apiSlice.ts";
import type {ApiResponse} from "../../utils/ApiResponse.ts";
import type {Order} from "../../../global/types.ts";

interface CheckOutItem{
    sellBookId: number;
    quantity: number;
}

interface CheckOutRequest{
    items: CheckOutItem[];
    shippingAddress:{
        address: string;
        phone: string;
    }
}

export const orderApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAdminOrders: builder.query<Order[], undefined>({
            query:() => '/admin/orders',
            transformResponse: (response:ApiResponse<Order[]>) => response.data?? [],
            providesTags: ['Order'],
            keepUnusedDataFor: 60 * 60 * 24,
        }),
        updateOrderByAdmin: builder.mutation<Order, {status: string, orderId:number }>({
            query:({status , orderId}) => ({
                url: `/admin/orders/${orderId}/status`,
                method: 'PUT',
                body: {status}
            }),

            async onQueryStarted({ orderId, status }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    orderApiSlice.util.updateQueryData('getAdminOrders', undefined, (draft) => {
                        const order = draft.find((o) => o.id === orderId);
                        if (order) order.status = status;
                    })
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },

        }),
        getClientOrders: builder.query<Order[], undefined>({
            query:()=>`/orders/my-orders`,
            transformResponse: (response:ApiResponse<Order[]>) => response.data ?? [],
            providesTags: ['MyOrders']

        }),
        getClientOrderById: builder.query<Order,string>({
            query: (orderNumber) => `/orders/my-orders/${orderNumber}`,
            transformResponse: (response: ApiResponse<Order>) => {
                if (!response.data) {
                    throw new Error("Order not found");
                }
                return response.data
            },
            providesTags: (_result, _error, orderNumber) => [
                { type: 'SpecificOrder', id: orderNumber },
            ],
        }),
        checkOut: builder.mutation<Order, CheckOutRequest>({
            query:(body) =>({
                url: `/orders/checkout`,
                method: 'POST',
                body: body
            }),
            transformResponse: (response: ApiResponse<{ newOrder: Order }>) =>{
                if (!response.data) {
                    throw new Error("Order not found");
                }
                return response.data.newOrder
            },
            async onQueryStarted(_arg,{dispatch,queryFulfilled}){
                try{
                    const{data:newOrder} = await queryFulfilled;
                    dispatch(
                        orderApiSlice.util.updateQueryData('getClientOrders', undefined, (draft)=>{
                            draft.unshift(newOrder)
                            return draft
                        })
                    )

                }catch(error){
                    console.log("Failed to update cache after checkout:", error)
                }
            }

        }),


    })
});

export const { useGetAdminOrdersQuery,
    useUpdateOrderByAdminMutation,
    useGetClientOrdersQuery,
    useGetClientOrderByIdQuery,
    useCheckOutMutation,
} = orderApiSlice;