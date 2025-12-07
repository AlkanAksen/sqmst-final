import React from "react";

export function Progress({ value = 0, className = "" }) {
    const safe = Math.min(100, Math.max(0, Number(value) || 0));

    return (
        <div
            className={
                "w-full bg-neutral-800 rounded-full overflow-hidden " + className
            }
        >
            <div
                className="h-full bg-gradient-to-r from-[#6C3CF0] to-[#D240A8]"
                style={{ width: `${safe}%`, height: "100%" }}
            />
        </div>
    );
}
