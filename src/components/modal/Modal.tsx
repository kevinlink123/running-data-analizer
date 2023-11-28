import React from "react";
import Backdrop from "./Backdrop";

import { motion } from "framer-motion";

const dropIn = {
    hidden: {
        y: "-100vh",
        opacity: 0,
    },
    visible: {
        y: "0",
        opacity: 1,
        transition: {
            duration: 0.1,
            type: "spring",
            damping: 25,
            stiffness: 500,
        },
    },
    exit: {
        y: "100vh",
        opacity: 0,
    },
};

interface ModalProps {
    handleClose: () => void;
    children: any;
}

export default function Modal({ children, handleClose }: ModalProps) {
    return (
        <Backdrop onClick={handleClose}>
            <motion.div
                onClick={(e) => e.stopPropagation()}
                className="modal flex items-center justify-center"
                variants={dropIn}
                initial='hidden'
                animate='visible'
                exit='exit'
            >
                
                <div className="relative w-4/5 px-6 py-10 font-mono text-slate-800 bg-white rounded-xl">
                    {children}
                    <div className="absolute -top-4 -right-4">
                        <svg
                            onClick={handleClose}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-8 h-8 fill-slate-100 cursor-pointer"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                </div>
            </motion.div>
        </Backdrop>
    );
}
