import {apiSlice} from "../api/apiSlice.ts";
import type {Book} from "../../../global/types.ts";
import type {ApiResponse} from "../../utils/ApiResponse.ts";

type ListingPayload = {
    price: number; currency: string; stockQuantity: number;
    condition: string; isActive: boolean;
};

export const listingApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getListings: builder.query<Book[], string>({
            query: (searchTerm) => searchTerm ? `/admin/sell-books/search?q=${searchTerm}`: '/admin/sell-books',
            providesTags: ['listing',],
            transformResponse: (response:ApiResponse<Book[]>) => response.data??[]
        }),
        listBookToStore: builder.mutation<Book, ListingPayload & {bookId: number}>({
            query: (body) => ({
                url: '/admin/sell-books',
                method: 'POST',
                body: body
            }),

            async onQueryStarted(_book,{dispatch, queryFulfilled}){
                try{
                    const {data:listedBook} = await queryFulfilled;
                    dispatch(
                        listingApiSlice.util.updateQueryData('getListings','', (draft) => {
                            draft.push(listedBook)
                            return draft
                        })

                    )
                }catch(error) {
                    console.error("Failed to update cache after saving book:", error);
                }
            }
        }),
        updateListedBook: builder.mutation<Book, {id:number, body: ListingPayload}>({
            query: ({id, body}) => ({
                url: `/admin/sell-books/${id}`,
                method: 'PUT',
                body: body
            }),

            async onQueryStarted({id,body},{dispatch,queryFulfilled}){
                const updatedResult = dispatch(
                    listingApiSlice.util.updateQueryData('getListings', '', (draft)=>{
                        const item = draft.find((b) => b.id === id);
                        if (item) Object.assign(item, body);
                    })
                );
                try{
                    await  queryFulfilled;
                }catch {
                    updatedResult.undo();
                }

            }
        })

    })
});

export const {useGetListingsQuery, useListBookToStoreMutation, useUpdateListedBookMutation} = listingApiSlice;