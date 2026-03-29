import { useCart } from "../providers/CartProvider";
import { CircleMinus, CirclePlus, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useMemo } from "react";

export default function Cart() {
  const { items, dispatch } = useCart();
  const navigate = useNavigate();

  const totalCost = useMemo(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  const handleRemoveFromCart = (sellBookId: number) => {
    dispatch({
      type: "REMOVE_FROM_CART",
      payload: {
        sellBookId,
      },
    });
  };

  const handleUpdateQuantity = (
    sellBookId: number,
    currentQuantity: number,
    change: number,
  ) => {
    const newQuantity = currentQuantity + change;
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: {
        sellBookId,
        quantity: newQuantity,
      },
    });
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 text-center max-w-md w-full shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-3">
            Your cart is empty
          </h2>
          <p className="text-slate-400 mb-6">
            Looks like you haven't added any books to your journey yet.
          </p>
          <Link
            to="/"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Shopping Cart</h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1 space-y-4">
          {items.map((item) => (
            <div
              key={item.sellBookId}
              className="flex flex-col sm:flex-row items-center bg-slate-800 p-4 rounded-xl shadow-md gap-4 border border-slate-700"
            >
              <Link to={`/books/${item.sellBookId}`}>
                <img
                src={item.coverImage}
                alt={item.title}
                className="w-24 h-36 object-cover rounded-md shadow-sm cursor-pointer"
              />
              </Link>

              <div className="flex-1 text-center sm:text-left w-full">
                <h2 className="text-xl font-semibold text-white line-clamp-1">
                  {item.title}
                </h2>
                <p className="text-slate-400 text-sm mt-1">{item.author}</p>
                <p className="text-lg font-bold text-indigo-400 mt-2">
                  {item.price}
                  {item.currency}
                </p>
              </div>

              <div className="flex items-center gap-4 mt-4 sm:mt-0">
                <div className="flex items-center gap-2 bg-slate-900 rounded-lg p-1 border border-slate-700">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.sellBookId, item.quantity, -1)
                    }
                    className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <CircleMinus size={20} />
                  </button>

                  <span className="text-white font-semibold w-6 text-center">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.sellBookId, item.quantity, 1)
                    }
                    className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <CirclePlus size={20} />
                  </button>
                </div>

                <button
                  onClick={() => handleRemoveFromCart(item.sellBookId)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer"
                  title="Remove item"
                >
                  <Trash2 size={22} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full lg:w-80 bg-slate-800 p-6 rounded-xl shadow-xl border border-slate-700 h-fit sticky top-24">
          <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-slate-300">
              <span>Subtotal</span>
              <span>{totalCost.toLocaleString()} MMK</span>
            </div>
            <div className="flex justify-between text-slate-300 pb-4 border-b border-slate-600">
              <span>Shipping</span>
              <span className="text-slate-500 text-sm">
                Calculated at checkout
              </span>
            </div>
            <div className="flex justify-between text-white font-bold text-lg">
              <span>Total</span>
              <span className="text-indigo-400">
                {totalCost.toLocaleString()} MMK
              </span>
            </div>
          </div>

          <button 
            onClick={() => navigate("/checkout")}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg transition-colors active:scale-[0.98] shadow-lg cursor-pointer">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
