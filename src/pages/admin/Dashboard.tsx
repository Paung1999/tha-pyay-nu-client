
import Loading from "../../components/Loading";

import { Banknote, BookOpenCheck, User2 } from "lucide-react";
import {useGetAdminOrdersQuery,} from "../../libs/features/orders/orderApiSlice.ts";
import WithAdminAuth from "../../auth/WithAdminAuth.tsx";



 function Dashboard(){

    const {data: orders, isLoading, isError} = useGetAdminOrdersQuery(undefined);

    if(isLoading){
        return <Loading />
    }
    if(isError){
        return <h1>Something went wrong</h1>
    }

    const totalRevenue = orders?.reduce((total, order) => total + order.total,0);

   const totalBookSold = orders
    // 1. Filter out the cancelled orders (Fixed typo)
    ?.filter(order => order.status !== "CANCELLED") 
    // 2. Reduce the remaining orders
    .reduce((total, order) => {
        // 3. Add up the 'quantity' of each item in this specific order
        const booksInThisOrder = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
        
        // 4. Add it to the grand total
        return total + booksInThisOrder;
    }, 0) || 0;

    const totalCustomers = orders?.reduce<number[]>((uniqueIds, order)=>{
        if(!uniqueIds.includes(order.userId)){
            uniqueIds.push(order.userId);
        
        }
        return uniqueIds;
    },[]).length || 0;



    return(
        <div className="max-w-7xl mx-auto space-y-6 relative">
            <div className="flex flex-col items-center justify-start p-3">
                <h1 className="text-2xl font-bold text-white">Welcome to the Admin Dashboard</h1>
                <p className="text-slate-400">You can see overview and insight of ThaPyayNu here.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-8">
                <div className="bg-slate-700 border border-slate-500 rounded-lg shadow group">
                    <div className="flex flex-col justify-between items-start p-4">
                        <div className="flex flex-row justify-between items-center gap-3 mb-2">
                            <Banknote/>
                        </div>

                        <div className="flex flex-col justify-between items-center"> 
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Total revenue
                            </span>
                            <span className="text-3xl font-black text-white group-hover:scale-105 transition-transform origin-left">
                                {totalRevenue?.toLocaleString() || 0}
                            </span>
                            
                        </div>

                    </div>

                </div>
                <div className="bg-slate-700 border-slate-500 border rounded-lg shadow group">
                    <div className="flex flex-col justify-between items-start p-4">
                        <div className="flex flex-row justify-between items-center gap-3 mb-2">
                            <BookOpenCheck />
                        </div>

                        <div className="flex flex-col justify-between items-center"> 
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                 Books Sold
                            </span>
                            <span className="text-3xl font-black text-white group-hover:scale-105 transition-transform origin-left">
                                {totalBookSold.toLocaleString() || 0}
                            </span>
                            
                        </div>

                    </div>

                </div>
                <div className="bg-slate-700 border border-slate-500 rounded-lg shadow group">
                    <div className="flex flex-col justify-between items-start p-4 ">
                        <div className="flex flex-row justify-between items-center gap-3 mb-2">
                            <User2 />
                        </div>

                        <div className="flex flex-col justify-between items-center"> 
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Total Customers
                            </span>
                            <span className="text-3xl font-black text-white group-hover:scale-105 transition-transform origin-left">
                                {totalCustomers.toLocaleString() || 0}
                            </span>
                            
                        </div>

                    </div>

                </div>

            </div>
            
        </div>
    );

}

 const AuthDashboard = WithAdminAuth(Dashboard);
 export default AuthDashboard;