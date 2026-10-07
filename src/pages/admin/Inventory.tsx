
import Loading from "../../components/Loading";
import {  Search, X } from "lucide-react";
import {useEffect, useRef, useState} from "react";
import DeleteBookButton from "../../components/DeleteBookButton.tsx";
import {useGetAdminBooksQuery} from "../../libs/features/book/bookApiSlice.ts";
import useDialog from "../../hooks/useDialog.ts";
import BookDialog from "../../components/BookDialog.tsx";
import type { CatalogBook} from "../../global/types.ts";
import ListingDialog from "../../components/ListingDialog.tsx";



function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function Inventory() {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);
  const {open:bookDlgOpen, setOpen:bookDlgSetOpen, handleClose } = useDialog()
  const {open:listingDlgOpen, setOpen:listingDlgSetOpen, handleClose:listingDlgHandleClose} = useDialog();
  const selectedBookRef = useRef<CatalogBook| undefined >(undefined);

  const {
    data: books,
    isLoading,
    isError,
  } = useGetAdminBooksQuery(debouncedSearch);


  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return (
      <div className="text-red-400 p-8 text-center">
        Error loading inventory. Are you logged in as an Admin?
      </div>
    );
  }
  if (books?.length === 0) {
    return (
        <div className="p-12 text-center text-slate-400">
          No books found matching "{searchInput}".
        </div>
    )
  }

  const editBookHandler = (book:CatalogBook) => {
    selectedBookRef.current = book;
    bookDlgSetOpen(true)
  }
  const newBookHandler = () => {
    selectedBookRef.current = undefined;
    bookDlgSetOpen(true)
  }

  const newListingHandler = (book:CatalogBook) => {
    selectedBookRef.current = book;
    listingDlgSetOpen(true);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative">
      <div className="flex flex-row justify-between items-center ">
        <div className="">
          <h1 className="text-2xl font-bold text-white">Book Inventory</h1>
          <p className="text-slate-400">Manage your book inventory here.</p>
        </div>
        <div className="flex items-center gap-4 ">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by title or author..."
              className="w-full bg-slate-800 text-slate-200 placeholder-slate-400 border border-slate-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none
                            focus:ring-2 focus:indigo-500 transition-all"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            onClick={ newBookHandler}
            className="bg-indigo-800 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors cursor-pointer"
          >
            Add new Book
          </button>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-md overflow-hidden">
        <table className="w-full text-left border border-collapse">
          <thead>
            <tr className="bg-slate-900/50 text-slate-400 text-sm border-b border-slate-700 ">
              <th className="p-4 font-medium w-24">Cover</th>
              <th className="p-4 font-medium">Title</th>
              <th className="p-4 font-medium">Author</th>
              <th className="p-4 font-medium">Listing</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books?.map((book) => (
              <tr
                key={book.id}
                className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors"
              >
                <td className="p-4">
                  <img
                    src={book.coverImage}
                    alt=""
                    className="w-12  h-16 object-cover rounded shadow-sm"
                  />
                </td>
                <td className="p-4 text-white font-semibold">{book.title}</td>
                <td className="p-4 text-slate-400">{book.author}</td>
                <td className="p-4 text-slate-400">
                  <button
                    onClick={()=> newListingHandler(book)}
                    className="bg-indigo-800 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md hover:shadow-indigo-500/20 cursor-pointer"
                  >
                    List
                  </button>
                </td>
                <td className="p-4 text-right">
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => editBookHandler(book)
                      }
                      className="text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer mr-3"
                    >
                      Edit
                    </button>
                    <DeleteBookButton book={book} />
                  </div>
                </td>
              </tr>
            ))}
            {books?.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-400">
                  No books found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <BookDialog open={bookDlgOpen} handleClose={handleClose} bookToEdit={selectedBookRef.current} />
      <ListingDialog open={listingDlgOpen} handleClose={listingDlgHandleClose} bookId={selectedBookRef?.current?.id} />
    </div>
  );
}
