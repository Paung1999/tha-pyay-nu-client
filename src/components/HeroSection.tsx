import { ArrowRight, BookOpen, Library } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <div className="w-full bg-slate-900 overflow-hidden rounded-2xl border border-slate-800 my-4 shadow-xl">
      <div className="flex flex-col md:flex-row items-center px-6 py-12 md:py-16 lg:px-12 gap-10">
        
        {/* Left Side: Text Content & Actions */}
        <div className="flex-1 flex flex-col items-start text-left space-y-6 z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
            Read Your Way. <br className="hidden md:block" />
            <span className="text-indigo-500">Buy or Borrow.</span>
          </h1>
          
          <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
            Discover thousands of titles. Own your favorites forever, or borrow 
            them for a fraction of the cost—all delivered straight to your door.
          </p>
          
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4 pt-2">
            <button 
              onClick={() => {
                // Optional: Scroll to browse section logic
                window.scrollTo({ top: document.getElementById('browse-section')?.offsetTop, behavior: 'smooth' });
              }}
              className="flex items-center justify-center gap-2 w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-lg font-semibold transition-colors duration-300 shadow-lg shadow-indigo-600/20 active:scale-95 cursor-pointer"
            >
              Browse Catalog
              <ArrowRight size={20} />
            </button>
            
            <Link 
              to="/borrowing-info" 
              className="flex items-center justify-center gap-2 w-full sm:w-auto bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-white px-8 py-3.5 rounded-lg font-semibold transition-colors duration-300 active:scale-95 cursor-pointer"
            >
              <Library size={20} className="text-slate-400" />
              Learn About Borrowing
            </Link>
          </div>
        </div>

        {/* Right Side: Visual Placeholder */}
        <div className="flex-1 w-full relative flex items-center justify-center min-h-[300px] md:min-h-[400px]">
          {/* Abstract Glow Background */}
          <div className="absolute inset-0 bg-indigo-600/20 blur-[100px] rounded-full max-w-md mx-auto" />
          
          {/* Stylized Floating Book Mockups */}
          <div className="relative z-10 flex items-center justify-center w-full h-full group perspective-1000">
            {/* Back Left Book */}
            <div className="absolute w-2/5 md:w-1/3 aspect-[2/3] bg-slate-800 border border-slate-700 rounded-lg shadow-2xl -rotate-12 -translate-x-12 md:-translate-x-16 opacity-70 flex items-center justify-center transition-transform duration-500 group-hover:-translate-x-20 group-hover:-rotate-6">
              <Library className="text-slate-600 w-12 h-12" />
            </div>
            
            {/* Back Right Book */}
            <div className="absolute w-2/5 md:w-1/3 aspect-[2/3] bg-indigo-950 border border-indigo-800 rounded-lg shadow-2xl rotate-12 translate-x-12 md:translate-x-16 opacity-70 flex items-center justify-center transition-transform duration-500 group-hover:translate-x-20 group-hover:rotate-6">
              <BookOpen className="text-indigo-500/50 w-12 h-12" />
            </div>
            
            {/* Center Front Book */}
            <div className="absolute w-1/2 md:w-2/5 aspect-[2/3] bg-slate-800 border border-slate-600 rounded-lg shadow-2xl z-20 flex items-center justify-center backdrop-blur-sm transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-4 bg-gradient-to-br from-slate-700 to-slate-900">
              <div className="w-full h-full border-l-4 border-indigo-500 rounded-l-sm flex items-center justify-center">
                <BookOpen className="text-slate-300 w-16 h-16" />
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}