import type { Book } from "../global/types";
import { useCart } from "../providers/CartProvider";
import { Link } from "react-router-dom";


export default function BookCard({ listedBook }: { listedBook: Book }) {
  const { dispatch, setIsCartOpen } = useCart();


  const handleAddToCart = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        sellBookId: listedBook.book.id,
        price: listedBook.price,
        currency: listedBook.currency,
        title: listedBook.book.title,
        author: listedBook.book.author,
        coverImage: listedBook.book.coverImage,
        quantity: 1,
      },
    });
    setIsCartOpen(true);
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-slate-800 rounded-xl border border-slate-700 shadow-lg hover:shadow-xl hover:border-slate-600 transition-all duration-300 hover:-translate-y-1.5 group">
      
      <Link to={`/books/${listedBook.book.id}`} className="relative aspect-[2/3] w-full overflow-hidden bg-slate-700">
          <img
            src={listedBook.book.coverImage}
            alt={listedBook.book.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      <div className="flex flex-col flex-1 p-4">
        <Link to={`/books/${listedBook.book.id}`}>
          <h1 className="text-white font-semibold text-base line-clamp-1 group-hover:text-indigo-400 transition-colors">
            {listedBook.book.title}
          </h1>
          <h2 className="text-slate-400 text-sm mt-0.5 line-clamp-1">
            {listedBook.book.author}
          </h2>
        </Link>

        <div className="mt-auto pt-2 flex flex-col gap-3">
          <p className="text-indigo-400 font-bold text-lg">
            {listedBook.price} <span className="text-sm font-medium opacity-80">{listedBook.currency}</span>
          </p>

          <button
            onClick={handleAddToCart}
            className="w-full py-2.5 bg-indigo-700 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-sm rounded-lg transition-all shadow-md shadow-indigo-500/20 active:scale-[0.98] cursor-pointer"
          >
            Add to cart
          </button>
        </div>
      </div>
      
    </div>
  );
}
