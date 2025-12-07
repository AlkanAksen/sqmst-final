import React from "react";

export function Badge({ children, className = "" }) {
    return (
        <span
            className={`inline-block text-xs px-2 py-1 rounded-md ${className}`}
        >
      {children}
    </span>
    );
}
