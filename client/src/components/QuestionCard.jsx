import { motion } from "framer-motion";
import { clsx } from "clsx";

export default function QuestionCard({ q, selected, onSelect, questionIndex }) {
    return (
        <motion.div
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                <h4 className="text-sm sm:text-base font-semibold text-gray-900 leading-snug">
                    <span className="text-indigo-600 font-bold mr-2">Q{questionIndex + 1}.</span>
                    {q.question}
                </h4>
            </div>

            <div className="p-3 sm:p-4 space-y-2.5">
                {q.options.map((op, i) => {
                    const isSelected = selected === i;
                    return (
                        <motion.div
                            key={i}
                            whileHover={{ backgroundColor: "#f8fafc" }}
                            whileTap={{ scale: 0.995 }}
                            onClick={() => onSelect(i)}
                            className={clsx(
                                "cursor-pointer px-3.5 py-2.5 rounded-lg border transition-all flex items-center group",
                                isSelected
                                    ? "border-indigo-600 bg-indigo-50/50 shadow-sm"
                                    : "border-gray-200 hover:border-indigo-200"
                            )}
                        >
                            <div className={clsx(
                                "w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center flex-shrink-0 transition-colors",
                                isSelected ? "border-indigo-600 bg-indigo-600" : "border-gray-300 group-hover:border-indigo-400"
                            )}>
                                {isSelected && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                )}
                            </div>
                            <span className={clsx(
                                "text-gray-700 font-medium text-xs sm:text-sm",
                                isSelected ? "text-indigo-900 font-semibold" : ""
                            )}>
                                {op}
                            </span>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}
