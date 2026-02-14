/**
 * Reusable Modal Component
 * Glassmorphic modal with backdrop blur
 */

import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-md' }) => {
    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px] animate-fadeIn">
            {/* Backdrop - Click to close */}
            <div
                className="absolute inset-0"
                onClick={onClose}
                aria-label="Close modal"
            />

            {/* Modal Content */}
            <div className={`relative w-full ${maxWidth} glass-dialog rounded-2xl overflow-hidden animate-scaleIn`}>
                {/* Decorative Blurs */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

                {/* Content */}
                <div className="relative p-6 sm:p-8">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-white dark:text-white flex items-center gap-2">
                                {title}
                            </h2>
                            {subtitle && (
                                <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full p-1.5"
                            aria-label="Close"
                        >
                            <span className="material-icons-round text-xl">close</span>
                        </button>
                    </div>

                    {/* Body */}
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
