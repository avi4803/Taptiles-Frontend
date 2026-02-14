import React from 'react';

const GlassButton = ({ children, onClick, icon, ...props }) => {
    return (
        <button
            onClick={onClick}
            className="group relative w-full transform transition-all hover:-translate-y-1"
            {...props}
        >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200 animate-pulse"></div>
            <div className="relative flex items-center justify-center bg-gray-900 rounded-lg leading-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 opacity-90 group-hover:opacity-100 transition duration-200"></div>
                <span className="relative py-4 px-8 text-white font-bold text-xl uppercase tracking-widest flex items-center gap-3">
                    {children}
                    {icon && <span className="material-icons-round group-hover:translate-x-1 transition-transform">{icon}</span>}
                </span>
            </div>
        </button>
    );
};

export default GlassButton;
