import { ClipboardList, Package, Truck, CircleCheck, CircleX } from "lucide-react";

const getStepNumber = (status: string)=> {
    switch(status?.toUpperCase()){
        case "CREATED" : return 0;
        case "PENDING": return 1;
        case "SHIPPED": return 2;
        case "DELIVERED": return 3;
        default : return -1;
    }
};

export default function OrderTracker({status}:{status:string}){
    const isCancelled = status?.toUpperCase() === "CANCELLED";
    const currentStep = getStepNumber(status);

    if(isCancelled){
        return(
            <div className="w-full max-w-3xl mx-auto mb-10 mt-6 px-4">
                <div className="flex flex-col items-center justify-center p-8 bg-red-500/10 border border-red-500/20 rounded-2xl shadow-lg">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                        <CircleX className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-red-400 mb-2">Order Cancelled</h3>
                    <p className="text-slate-400 text-sm text-center">
                        This order has been cancelled and will not be delivered.
                    </p>
                </div>
            </div>
        )
    }

    const steps = [
        {id:0, label: "Created", icon: ClipboardList},
        {id:1, label: "Pending", icon: Package},
        {id:2, label: "Shipped", icon: Truck},
        {id:3, label: "Delivered", icon: CircleCheck},
    ]

    return(
        <div className="w-full max-w-3xl mx-auto mb-10 mt-6 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-800 rounded-full z-0"/>

                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-500 rounded-full z-0 transition-all duration-500 ease-in-out"
                    style={{width: `${currentStep/ (steps.length-1)*100}%`}}
                />

                {steps.map((step)=> {
                    const isCompleted = currentStep >= step.id;
                    const isActive = currentStep === step.id;
                    const Icon = step.icon;
                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
                           
                            <div className={`
                                w-12 h-12 rounded-full flex items-center justify-center border-4 border-[#1a1f2e] transition-colors duration-500
                                ${isCompleted ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-slate-800 text-slate-500'}
                            `}>
                                <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
                            </div>
                            
                          
                            <span className={`
                                text-xs sm:text-sm font-bold absolute -bottom-8 whitespace-nowrap transition-colors duration-500
                                ${isCompleted ? 'text-indigo-300' : 'text-slate-500'}
                            `}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}

            </div>

        </div>

    )
}