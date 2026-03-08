import { cn } from "@/lib/utils";

export const HexGrid = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 320 360"
        className={cn("pointer-events-none select-none", className)}
        aria-hidden
    >
        {Array.from({ length: 5 }, (_, row) =>
            Array.from({ length: 4 }, (_, col) => {
                const x = col * 70 + (row % 2 === 0 ? 0 : 35);
                const y = row * 58;
                return (
                    <polygon
                        key={`${row}-${col}`}
                        points={`${x + 28},${y + 4} ${x + 52},${y + 17} ${x + 52},${y + 42} ${x + 28},${y + 55} ${x + 4},${y + 42} ${x + 4},${y + 17}`}
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth="0.8"
                    />
                );
            })
        )}
    </svg>
);
