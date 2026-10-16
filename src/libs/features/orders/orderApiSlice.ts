import {apiSlice} from "../api/apiSlice.ts";
import type {ApiResponse} from "../../utils/ApiResponse.ts";
import type {Order} from "../../../global/types.ts";
import type {RootState} from "../../../app/store.ts";

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

interface Pagination{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface OrderResponse{
    message: string;
    data: Order[];
    pagination: Pagination;
}

interface GetOrderArgs{
    page?: number;
    limit?: number;
    status?: string | undefined
}

interface OrderStats{
    totalRevenue: number;
    totalBookSold: number;
    totalCustomers: number;
}

export const orderApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAdminOrders: builder.query<OrderResponse, GetOrderArgs>({
            query:({page, limit=10, status}) => ({
                url: '/admin/orders',
                params: {page,limit,status}
            }),
            providesTags: ['Order'],
            keepUnusedDataFor: 60 * 60 * 24,
        }),
        getAdminOrderStats: builder.query<OrderStats, void>({
            query:() => '/admin/orders/stats',
            transformResponse:(response: ApiResponse<OrderStats>) =>
                response.data ?? { totalRevenue: 0, totalBookSold: 0, totalCustomers: 0 },
            providesTags: ['Order'],

        }),
        updateOrderByAdmin: builder.mutation<Order, {status: string, orderId:number }>({
            query:({status , orderId}) => ({
                url: `/admin/orders/${orderId}/status`,
                method: 'PUT',
                body: {status}
            }),

            async onQueryStarted({ orderId, status }, { dispatch,getState, queryFulfilled }) {
                const patches = orderApiSlice.util
                    .selectInvalidatedBy(getState() as RootState, ['Order'])
                    .filter(({ endpointName }) => endpointName === 'getAdminOrders')
                    .map(({ originalArgs }) =>
                        dispatch(
                            orderApiSlice.util.updateQueryData('getAdminOrders', originalArgs, (draft) => {
                                const order = draft.data.find((o) => o.id === orderId);
                                if (order) order.status = status;
                            })
                        )
                    );
                try {
                    await queryFulfilled;
                } catch {
                    patches.forEach((patch) => patch.undo());
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

export const {
    useGetAdminOrdersQuery,
    useGetAdminOrderStatsQuery,
    useUpdateOrderByAdminMutation,
    useGetClientOrdersQuery,
    useGetClientOrderByIdQuery,
    useCheckOutMutation,
} = orderApiSlice;