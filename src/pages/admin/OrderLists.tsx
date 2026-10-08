

import StatusDropdown from "../../components/StatusDropdown";
import Loading from "../../components/Loading";
import { ClipboardList, Clock, Truck } from "lucide-react";
import {useGetAdminOrdersQuery} from "../../libs/features/orders/orderApiSlice.ts";


export default function OrderLists() {
  const {
    data: orders,
    isLoading,
    isError,
  } = useGetAdminOrdersQuery(undefined)

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <h1>Something went wrong</h1>;
  }
  return (
    <div className="max-w-7xl mx-auto spce-y-6 relative">
      <div className="flex flex-row justify-between items-center mb-4">
        <div className="">
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <p className="text-slate-400">Manage your orders here.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full">
        <div className="bg-[#1e2336] border border-slate-800 border-l-4 border-l-indigo-500 rounded-xl p-6 hover:bg-slate-800 transition-all shadow-lg group">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Total Orders
              </span>
              <span className="text-3xl font-black text-white group-hover:scale-105 transition-transform origin-left">
                {orders?.length || 0}
              </span>
            </div>
            <div className="p-3 bg-indigo-500/10 rounded-lg">
              <ClipboardList className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
        </div>

        {/* Card 2: Pending Orders */}
        <div className="bg-[#1e2336] border border-slate-800 border-l-4 border-l-amber-500 rounded-xl p-6 hover:bg-slate-800 transition-all shadow-lg group">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Pending Orders
              </span>
              <span className="text-3xl font-black text-white group-hover:scale-105 transition-transform origin-left">
                {orders?.filter(
                  (order) =>
                    order.status === "PENDING"
                ).length || 0}
              </span>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-lg">
              <Clock className="w-6 h-6 text-amber-400" />
            </div>
          </div>
        </div>

        {/* Card 3: Orders in Transit */}
        <div className="bg-[#1e2336] border border-slate-800 border-l-4 border-l-blue-500 rounded-xl p-6 hover:bg-slate-800 transition-all shadow-lg group">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Orders in Transit
              </span>
              <span className="text-3xl font-black text-white group-hover:scale-105 transition-transform origin-left">
                {orders?.filter((order) => order.status === "SHIPPED").length ||
                  0}
              </span>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Truck className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-md overflow-hidden">
        <table className="w-full text-left border border-collapse">
          <thead>
            <tr className="bg-slate-900/50 text-slate-400 text-sm border-b border-slate-700">
              <th className="p-4 font-medium w-24">Order Number</th>
              <th className="p-4 font-medium w-24">Customer</th>
              <th className="p-4 font-medium w-24">Date</th>
              <th className="p-4 font-medium w-24">Items</th>
              <th className="p-4 font-medium w-24">Total</th>
              <th className="p-4 font-medium w-24">Status</th>
              {/* <th className="p-4 font-medium w-24">Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr
                key={order.id}
                className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors"
              >
                <td className="p-4 text-white font-semibold">
                  {order.orderNumber}
                </td>
                <td className="p-4 text-slate-400">{order.user.name}</td>
                <td className="p-4 text-slate-400">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>

                <td className="p-5">
                  <div className="flex items-center">
                    {order.orderItems
                      .slice(0, 2)
                      .map((item: any, index: number) => (
                        <div
                          key={item.id}
                          className={`w-8 h-10 rounded border border-slate-700 bg-slate-800 overflow-hidden shadow-sm ${index > 0 ? "-ml-3" : ""} relative z-${10 - index}`}
                        >
                          <img
                            src={
                              item.sellBook?.book?.coverImage ||
                              "/placeholder-book.png"
                            }
                            alt="cover"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    {order.orderItems.length > 2 && (
                      <div className="ml-2 text-xs font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded-md border border-slate-700">
                        +{order.orderItems.length - 2} more
                      </div>
                    )}
                  </div>
                </td>

                <td className="p-4 text-slate-400">{order.total}</td>
                <td className="p-4 text-slate-400">
                  <StatusDropdown
                    orderId={order.id}
                    currentStatus={order.status}
                  />
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
