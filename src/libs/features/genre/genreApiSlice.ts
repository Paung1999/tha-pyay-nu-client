import {bookApiSlice} from "../book/bookApiSlice.ts";
import type {Genre} from "../../../global/types.ts";
import type {ApiResponse} from "../../utils/ApiResponse.ts";

export const genreApiSlice = bookApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAdminGenres: builder.query<Genre[],undefined>({
            query: () => `/admin/genres`,
            transformResponse:(response:ApiResponse<Genre[]>) => response.data ?? [],
            providesTags: ['Genre'],
            keepUnusedDataFor: 60 * 60 * 24,
        }),

        saveGenre: builder.mutation<Genre,Omit<Genre, 'id'>>({
            query:(genre)=>({
                url: `/admin/genres/`,
                method: 'POST',
                body: genre
            }),
            transformResponse: (response: { message: string; data: Genre }): Genre => {
                return response.data;
            },
            async onQueryStarted(_genre, {dispatch, queryFulfilled}){
                try{
                    const {data:saveGenre} = await queryFulfilled;
                    dispatch(genreApiSlice.util.updateQueryData('getAdminGenres',undefined,(draft)=>{
                        draft.push(saveGenre)
                        return draft
                    }))

                }catch(error){
                    console.error("Failed to update cache after saving new genre:", error);
                }
            }
        }),

        deleteGenreById: builder.mutation<Genre,Genre>({
            query:(genre:Genre) => ({
                url: `/admin/genres/${genre.id}`,
                method: 'DELETE',
            }),
            async onQueryStarted(genre, {dispatch,queryFulfilled}){
                const deleteResult = dispatch(
                    genreApiSlice.util.updateQueryData('getAdminGenres',undefined, (draft)=>{
                        draft = draft.filter(g => g.id !== genre.id)
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
        updateGenreById: builder.mutation<Genre,Genre>({
            query:(genre:Genre) => ({
                url: `/admin/genres/${genre.id}`,
                method: 'PUT',
                body: {name: genre.name}
            }),
            async onQueryStarted(genre,{dispatch, queryFulfilled}){
                const updateResult = dispatch(
                    genreApiSlice.util.updateQueryData('getAdminGenres',undefined, (draft)=> {
                        draft = draft.map(g => g.id == genre.id ? genre : g)
                        return draft
                    })
                )
                try{
                    await queryFulfilled
                }catch{
                    updateResult.undo()
                }
            }

        }),

    }),
});

export const {
    useGetAdminGenresQuery,
    useSaveGenreMutation,
    useDeleteGenreByIdMutation,
    useUpdateGenreByIdMutation,
} = genreApiSlice;