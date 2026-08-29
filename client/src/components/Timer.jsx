import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { clsx } from "clsx";

export default function Timer({ endTime, onTimeUp }) {
    const [timeLeft, setTimeLeft] = useState(
        Math.max(0, new Date(endTime) - Date.now())
    );

    useEffect(() => {
        const interval = setInterval(() => {
            const remaining = new Date(endTime) - Date.now();
            setTimeLeft(Math.max(0, remaining));

            if (remaining <= 0) {
                clearInterval(interval);
                onTimeUp();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [endTime, onTimeUp]);

    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    const isUrgent = minutes < 5;

    return (
        <div className={clsx(
            "flex items-center space-x-3 font-mono text-2xl font-bold px-6 py-3 rounded-xl transition-colors shadow-sm border",
            isUrgent ? "bg-red-50 text-red-600 border-red-100 animate-pulse" : "bg-white text-indigo-600 border-indigo-50"
        )}>
            <Clock className="w-5 h-5" />
            <span className="tracking-widest">
                {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
            </span>
        </div>
    );
}
