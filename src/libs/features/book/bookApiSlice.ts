
import type {ApiResponse} from "../../utils/ApiResponse.ts";
import type {Genre, Book, CatalogBook} from "../../../global/types.ts";
import {apiSlice} from "../api/apiSlice.ts";

export const bookApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getGenres: builder.query<Genre[],undefined>({
            query:() => "/books/genres",
            transformResponse: (response: ApiResponse<Genre[]>) => response.data ?? [],
            providesTags: ['Genre'],
            keepUnusedDataFor: 60 * 60* 24
        }),

        getBooks: builder.query<Book[], number | null>({
            query: (genreId) =>  (genreId?`/books/genres/${genreId}`: "/books"),
            transformResponse: (response: ApiResponse<Book[]>) => response.data ?? [],
            providesTags: ['Book'],
            keepUnusedDataFor: 60 * 60 * 24
        }),

        getBookById: builder.query<Book, string>({
            query: (id) => `books/${id}`,
            transformResponse: (response:ApiResponse<Book>) => response.data as Book,
            providesTags: (_result, _error, id) => [{ type: 'Book', id }],

        }),
        searchBook: builder.query<Book[], string >({
            query: (searchTerm) => ({
                url: `/books/search`,
                params: {q: searchTerm.trim()}
            }),
            transformResponse: (response:ApiResponse<Book[]>) => response.data ?? []
        }),
        getAdminBooks: builder.query<CatalogBook[],string>({
            query: (searchterm) =>
                searchterm? `/admin/books/search?q=${searchterm}`: `/admin/books`,
            transformResponse: (response: ApiResponse<CatalogBook[]>) => response.data ?? [],
        }),
        saveAdminBook: builder.mutation<CatalogBook, FormData>({
            query:(formData) => ({
                url: `/admin/books`,
                method: 'POST',
                body: formData
            }),
            async onQueryStarted(_book,{dispatch, queryFulfilled}){
                try{
                    const {data:savedBook} = await queryFulfilled;
                    dispatch(
                        bookApiSlice.util.updateQueryData('getAdminBooks','', (draft) => {
                            draft.push(savedBook)
                            return draft
                        })

                    )
                }catch(error) {
                    console.error("Failed to update cache after saving book:", error);
                }
            }
        }),
        deleteInventoryBookById: builder.mutation<CatalogBook,CatalogBook>({
            query:(book) => ({
                url: `/admin/books/${book.id}`,
                method: 'DELETE'
            }),
            async onQueryStarted(book,{dispatch, queryFulfilled}){
                const deleteResult = dispatch(
                    bookApiSlice.util.updateQueryData('getAdminBooks', '', (draft)=>{
                        draft.filter(b=> b.id !== book.id)
                        return draft
                    })
                )
                try{
                    await queryFulfilled
                }catch{
                    deleteResult.undo()
                }
            }

        }),
        updateInventoryBookById: builder.mutation<CatalogBook,{id:number,body:FormData}>({
            query:({id,body}) => ({
                url: `/admin/books/${id}`,
                method: 'PUT',
                body: body
            }),
            async onQueryStarted(book,{dispatch,queryFulfilled}){
                const updateResult = dispatch(
                    bookApiSlice.util.updateQueryData('getAdminBooks','', (draft)=>{
                         draft.map(b=> b.id == book.id? book : b)
                        return draft
                    })
                )
                try{
                    await queryFulfilled
                }catch {
                    updateResult.undo()
                }
            }
        }),
    })
});

export const {
    useGetGenresQuery,
    useGetBooksQuery ,
    useGetBookByIdQuery,
    useSearchBookQuery,
    useGetAdminBooksQuery,
    useSaveAdminBookMutation,
    useDeleteInventoryBookByIdMutation,
    useUpdateInventoryBookByIdMutation,
} = bookApiSlice;