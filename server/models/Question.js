import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    question: String,
    options: [String],
    correctAnswer: Number, // index
    marks: {
        type: Number,
        default: 1
    },
    testSet: {
        type: Number,
        default: 1, // 1 for Mock Test 1, 2 for Mock Test 2, etc.
        index: true
    }
});

export default mongoose.model("Question", questionSchema);
