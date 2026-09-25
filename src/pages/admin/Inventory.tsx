import { useQuery,} from "@tanstack/react-query";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";
import {  Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import DeleteBookButton from "../../components/DeleteBookButton.tsx";

const api = "http://localhost:8800/api/v1/admin/books";

type Book = {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  description: string;
};

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function Inventory() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);

  const {
    data: books,
    isLoading,
    isError,
  } = useQuery<Book[]>({
    queryKey: ["books", debouncedSearch],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const endpoint = debouncedSearch
        ? `${api}/search?q=${debouncedSearch}`
        : `${api}`;
      const res = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        if (res.status === 401)
          throw new Error("Unauthorized: Please log in again");
        throw new Error("Failed to fetch books");
      }
      return res.json();
    },
  });


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
    <div className="p-12 text-center text-slate-400">
      No books found matching "{searchInput}".
    </div>;
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
            onClick={() => navigate("/admin/inventory/add-book")}
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
                    onClick={() =>
                      navigate("/admin/listings/create-listing", {
                        state: { selectedBook: book },
                      })
                    }
                    className="bg-indigo-800 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md hover:shadow-indigo-500/20 cursor-pointer"
                  >
                    List
                  </button>
                </td>
                <td className="p-4 text-right">
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() =>
                        navigate(`/admin/inventory/edit-book/${book.id}`)
                      }
                      className="text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer mr-3"
                    >
                      Edit
                    </button>
                    <DeleteBookButton bookId={book.id} />
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
    </div>
  );
}
