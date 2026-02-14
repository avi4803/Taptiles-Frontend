import React from 'react';


const GlassInput = ({ icon, placeholder, value, onChange, type = "text", ...props }) => {
    return (
        <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-purple-600/50 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative flex items-center bg-[#1c1d33]/80 backdrop-blur-xl border border-white/10 rounded-lg p-1 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all duration-300">
                <div className="flex items-center justify-center w-12 h-12 text-gray-400 group-focus-within:text-primary transition-colors">
                    <span className="material-icons-round text-2xl">{icon}</span>
                </div>
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    className="w-full bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 text-lg font-medium tracking-wide py-3 pr-4 outline-none"
                    placeholder={placeholder}
                    autoComplete="off"
                    {...props}
                />
            </div>
            <style jsx>{`
                input:-webkit-autofill,
                input:-webkit-autofill:hover, 
                input:-webkit-autofill:focus, 
                input:-webkit-autofill:active{
                    -webkit-box-shadow: 0 0 0 30px #1c1d33 inset !important;
                    -webkit-text-fill-color: white !important;
                }
            `}</style>
        </div>
    );
};

export default GlassInput;
