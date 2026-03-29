import { useMutation, useQueryClient } from "@tanstack/react-query";

const getStatusColor = (status: string)=>{
    switch(status?.toUpperCase()){
        case 'CREATED': return 'text-blue-400 bg-blue-400/10 border-blue-400/20 focus:ring-blue-400';
        case 'PENDING': return 'text-amber-400 bg-amber-400/10 border-amber-400/20 focus:ring-amber-400';
        case 'SHIPPED': return 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20 focus:ring-indigo-400';
        case 'DELIVERED': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20 focus:ring-emerald-400';
        case 'CANCELLED': return 'text-red-400 bg-red-400/10 border-red-400/20 focus:ring-red-400';
        default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20 focus:ring-slate-400';
    }
};

const api = "http://localhost:8800/api/v1/admin";

export default function StatusDropdown({orderId, currentStatus}: {orderId: number, currentStatus: string}){
    const queryClient = useQueryClient();
    const updateStatusMutation = useMutation({
        mutationFn: async(newStatus: string)=> {
            const token = localStorage.getItem("token");
            const res = await fetch(`${api}/orders/${orderId}/status`,{
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({status: newStatus})
            });
            if(!res.ok){
                throw new Error("Something went wrong");
            }
            return res.json();
        },
        onSuccess: ()=> {
            queryClient.invalidateQueries({queryKey: ["orders"]});
        },

    })
    return(
        <select value={currentStatus}
            onChange={(e)=> updateStatusMutation.mutate(e.target.value)}
            disabled={updateStatusMutation.isPending}
            className={`
                px-3 py-1.5 text-xs font-semibold rounded-lg border shadow-sm
                cursor-pointer outline-none transition-all
                ${getStatusColor(currentStatus)}
                ${updateStatusMutation.isPending ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110 focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-900'}
            `}
        >
            <option value="CREATED" className="bg-slate-900 text-slate-300">Created</option>
            <option value="PENDING" className="bg-slate-900 text-slate-300">Pending</option>
            <option value="SHIPPED" className="bg-slate-900 text-slate-300">Shipped</option>
            <option value="DELIVERED" className="bg-slate-900 text-slate-300">Delivered</option>
            <option value="CANCELLED" className="bg-slate-900 text-slate-300">Cancelled</option>
        </select>

    );
}