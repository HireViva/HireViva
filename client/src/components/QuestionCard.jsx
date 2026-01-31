import { motion } from "framer-motion";
import { clsx } from "clsx";

export default function QuestionCard({ q, selected, onSelect, questionIndex }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-8"
        >
            <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                <h4 className="text-xl md:text-2xl font-semibold text-gray-900 leading-relaxed">
                    <span className="text-indigo-600 font-bold mr-3">Q{questionIndex + 1}.</span>
                    {q.question}
                </h4>
            </div>

            <div className="p-8 space-y-4">
                {q.options.map((op, i) => {
                    const isSelected = selected === i;
                    return (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.01, backgroundColor: "#f8fafc" }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => onSelect(i)}
                            className={clsx(
                                "cursor-pointer p-6 rounded-2xl border-2 transition-all flex items-center group",
                                isSelected
                                    ? "border-indigo-600 bg-indigo-50/50 shadow-md"
                                    : "border-gray-200 hover:border-indigo-300 hover:shadow-sm"
                            )}
                        >
                            <div className={clsx(
                                "w-8 h-8 rounded-full border-2 mr-6 flex items-center justify-center flex-shrink-0 transition-colors",
                                isSelected ? "border-indigo-600 bg-indigo-600" : "border-gray-300 group-hover:border-indigo-400"
                            )}>
                                {isSelected && (
                                    <div className="w-3 h-3 rounded-full bg-white" />
                                )}
                            </div>
                            <span className={clsx(
                                "text-gray-700 font-medium text-lg md:text-xl",
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
