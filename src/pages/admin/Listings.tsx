
import Loading from "../../components/Loading";
import { Dot, Search, X } from "lucide-react";
import {useEffect, useRef, useState} from "react";
import DelistBookButton from "../../components/DelistBookButton.tsx";
import {useGetListingsQuery} from "../../libs/features/listing/listingApiSlice.ts";
import useDialog from "../../hooks/useDialog.ts";
import type {Book} from "../../global/types.ts";
import ListingDialog from "../../components/ListingDialog.tsx";



function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default function Listings() {

  const {open:listingDlgOpen, setOpen:listingDlgSetOpen , handleClose} = useDialog();
  const selectedBookRef = useRef<Book | undefined>(undefined);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);

  const {
    data: books,
    isLoading,
    isError,
  } = useGetListingsQuery(debouncedSearch);


  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return (
      <div className="text-red-400 p-8 text-center">
        Error loading listings. Are you logged in as an Admin?
      </div>
    );
  }

  const updateListingHandler = (listedBook: Book) => {
    selectedBookRef.current = listedBook;
    listingDlgSetOpen(true);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative ">
      <div className="flex flex-row justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Listings</h1>
          <p className="text-slate-400">Manage your listings here.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by title or author..."
              className="w-full bg-slate-800 text-slate-200 placeholder-slate-400 border border-slate-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:indigo-500 transition-all"
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
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-md overflow-hidden">
        <table className="w-full text-left border border-collapse">
          <thead>
            <tr className="bg-slate-900/50 text-slate-400 text-sm border-b border-slate-700">
              <th className="p-4 font-medium w-24">Cover</th>
              <th className="p-4 font-medium">Title & ISBN</th>
              <th className="p-4 font-medium">Author</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">isActive</th>
              <th className="p-4 font-medium">Stock Quantity</th>
              <th className="p-4 font-medium">Condition</th>
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
                    src={book.book?.coverImage}
                    alt={book.book?.title}
                    className="w-12 h-16 object-cover rounded shadow-sm"
                  />
                </td>
                <td className="p-4 text-white font-semibold">
                  <div className="flex flex-col items-start gap-2">
                    {book.book?.title}
                    <span className="text-slate-400 text-xs">
                      {book.book?.isbn && `(${book.book?.isbn})`}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-slate-400">{book.book?.author}</td>
                <td className="p-4 text-slate-400">
                  {book.price}
                  {book.currency}
                </td>
                <td className="p-4 text-slate-400">
                  <div className="flex items-center">
                    {book.isActive ? "Active" : "Inactive"}
                    {book.isActive && (
                      <Dot size={32} className="text-emerald-400 -ml-1" />
                    )}
                  </div>
                </td>
                <td className="p-4 text-slate-400 ">{book.stockQuantity}</td>
                <td className="p-4 text-slate-400">{book.condition}</td>
                <td className="p-4 text-right">
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => updateListingHandler(book)}
                      className="text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer mr-3"
                    >
                      Edit
                    </button>
                    <DelistBookButton bookId={book.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ListingDialog open={listingDlgOpen} handleClose={handleClose} listedBookToEdit={selectedBookRef.current} />
    </div>
  );
}
