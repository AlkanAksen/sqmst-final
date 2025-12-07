import React from "react";

export function Card({ children, className = "", ...props }) {
    return (
        <div
            className={`rounded-lg p-4 bg-[#2C2C2C] text-white ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children }) {
    return <div className="mb-3">{children}</div>;
}

export function CardTitle({ children, className = "" }) {
    return <h3 className={`text-xl font-semibold ${className}`}>{children}</h3>;
}

export function CardContent({ children }) {
    return <div>{children}</div>;
}

export function CardDescription({ children }) {
    return <p className="text-white/60">{children}</p>;
}
