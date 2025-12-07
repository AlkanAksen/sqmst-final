import React from "react";

export function Input({ className = "", ...props }) {
    return (
        <input
            {...props}
            className={
                "bg-black border border-white/20 rounded-md px-2 py-1 text-sm " +
                "text-white focus:outline-none focus:ring-2 focus:ring-[#9B4D96] " +
                className
            }
        />
    );
}
