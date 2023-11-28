import React from "react";
import { motion } from "framer-motion";

interface BackdropProps {
    children: any
    onClick: () => void;
}

export default function Backdrop({children, onClick}: BackdropProps) {
    return (
        <motion.div
            onClick={onClick}
            className="fixed z-50 h-screen w-screen top-0 left-0 bg-black/60 flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {children}
        </motion.div>
    )
}
