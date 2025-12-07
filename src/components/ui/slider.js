import React from "react";

export function Slider({
                           value = [0],
                           max = 100,
                           step = 1,
                           onValueChange,
                           className = "",
                       }) {
    const current = Array.isArray(value) ? value[0] : value;

    const handleChange = (e) => {
        const v = Number(e.target.value);
        if (onValueChange) onValueChange([v]);
    };

    const percent =
        max === 0 ? 0 : Math.min(100, Math.max(0, (current / max) * 100));

    return (
        <>
            {/* THUMB CSS — ayrı dosyaya gerek yok */}
            <style>
                {`
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            background: #000;      /* ← Tam siyah */
            border-radius: 50%;
            cursor: pointer;
          }

          input[type="range"]::-moz-range-thumb {
            width: 18px;
            height: 18px;
            background: #000;      /* ← Tam siyah */
            border-radius: 50%;
            cursor: pointer;
          }
        `}
            </style>

            <input
                type="range"
                min={0}
                max={max}
                step={step}
                value={current}
                onChange={handleChange}
                className={
                    "w-full h-2 rounded-lg appearance-none cursor-pointer " + className
                }
                style={{
                    background: `linear-gradient(to right,
            #9B4D96 0%,
            #9B4D96 ${percent}%,
            #27272a ${percent}%,
            #27272a 100%
          )`,
                }}
            />
        </>
    );
}
