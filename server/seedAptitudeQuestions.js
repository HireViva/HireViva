import mongoose from 'mongoose';
import 'dotenv/config.js';

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Aptitude Question Schema
const aptitudeQuestionSchema = new mongoose.Schema({
    question: String,
    options: [String],
    correctAnswer: Number,
    marks: {
        type: Number,
        default: 1
    },
    testSet: {
        type: Number,
        default: 1,
        index: true
    }
});

const AptitudeQuestion = mongoose.model("AptitudeQuestion", aptitudeQuestionSchema);

// Sample Aptitude Questions for Test Set 1
const sampleQuestions = [
    // Quantitative Aptitude Questions
    {
        question: "If a train travels 120 km in 2 hours, what is its average speed?",
        options: ["50 km/h", "60 km/h", "70 km/h", "80 km/h"],
        correctAnswer: 1,
        marks: 1,
        testSet: 1
    },
    {
        question: "What is 25% of 400?",
        options: ["75", "100", "125", "150"],
        correctAnswer: 1,
        marks: 1,
        testSet: 1
    },
    {
        question: "A shopkeeper sells an item at 20% profit. If the cost price is ₹500, what is the selling price?",
        options: ["₹550", "₹600", "₹650", "₹700"],
        correctAnswer: 1,
        marks: 1,
        testSet: 1
    },
    {
        question: "If 5 workers can complete a task in 12 days, how many days will 10 workers take?",
        options: ["4 days", "6 days", "8 days", "10 days"],
        correctAnswer: 1,
        marks: 1,
        testSet: 1
    },
    {
        question: "What is the compound interest on ₹10,000 at 10% per annum for 2 years?",
        options: ["₹2,000", "₹2,100", "₹2,200", "₹2,500"],
        correctAnswer: 1,
        marks: 1,
        testSet: 1
    },
    {
        question: "The ratio of boys to girls in a class is 3:2. If there are 15 boys, how many girls are there?",
        options: ["8", "10", "12", "15"],
        correctAnswer: 1,
        marks: 1,
        testSet: 1
    },
    {
        question: "What is the average of 10, 20, 30, 40, and 50?",
        options: ["25", "30", "35", "40"],
        correctAnswer: 1,
        marks: 1,
        testSet: 1
    },
    {
        question: "A rectangle has length 15 cm and width 10 cm. What is its area?",
        options: ["100 cm²", "125 cm²", "150 cm²", "175 cm²"],
        correctAnswer: 2,
        marks: 1,
        testSet: 1
    },

    // Logical Reasoning Questions
    {
        question: "If all roses are flowers and some flowers are red, which statement is definitely true?",
        options: [
            "All roses are red",
            "Some roses are red",
            "All flowers are roses",
            "Some roses may be flowers"
        ],
        correctAnswer: 3,
        marks: 1,
        testSet: 1
    },
    {
        question: "Complete the series: 2, 6, 12, 20, 30, ?",
        options: ["38", "40", "42", "44"],
        correctAnswer: 2,
        marks: 1,
        testSet: 1
    },
    {
        question: "If CODING is written as DPEJOH, how is PYTHON written?",
        options: ["QZUIPO", "QZUIPN", "QYUIPO", "QZUJPO"],
        correctAnswer: 1,
        marks: 1,
        testSet: 1
    },
    {
        question: "A is B's sister. C is B's mother. D is C's father. E is D's mother. How is A related to D?",
        options: ["Grandmother", "Granddaughter", "Daughter", "Great-granddaughter"],
        correctAnswer: 1,
        marks: 1,
        testSet: 1
    },
    {
        question: "In a certain code, if 'MOBILE' is coded as '459137', what is the code for 'LIME'?",
        options: ["3597", "3957", "7953", "9537"],
        correctAnswer: 0,
        marks: 1,
        testSet: 1
    },
    {
        question: "Find the odd one out: 3, 5, 11, 14, 17, 21",
        options: ["3", "5", "14", "21"],
        correctAnswer: 2,
        marks: 1,
        testSet: 1
    },

    // Verbal Ability Questions
    {
        question: "Choose the synonym of 'ABUNDANT':",
        options: ["Scarce", "Plentiful", "Limited", "Rare"],
        correctAnswer: 1,
        marks: 1,
        testSet: 1
    },
    {
        question: "Choose the antonym of 'OPTIMISTIC':",
        options: ["Hopeful", "Positive", "Pessimistic", "Confident"],
        correctAnswer: 2,
        marks: 1,
        testSet: 1
    },
    {
        question: "Fill in the blank: The project was completed _____ schedule.",
        options: ["ahead of", "behind of", "on of", "over of"],
        correctAnswer: 0,
        marks: 1,
        testSet: 1
    },
    {
        question: "Identify the correctly spelled word:",
        options: ["Accomodate", "Accommodate", "Acommodate", "Acomodate"],
        correctAnswer: 1,
        marks: 1,
        testSet: 1
    },
    {
        question: "Choose the correct sentence:",
        options: [
            "Neither of the students have completed their homework.",
            "Neither of the students has completed their homework.",
            "Neither of the students have completed his homework.",
            "Neither of the students has completed his homework."
        ],
        correctAnswer: 1,
        marks: 1,
        testSet: 1
    },
    {
        question: "What does the idiom 'A piece of cake' mean?",
        options: ["Very difficult", "Very easy", "Very expensive", "Very sweet"],
        correctAnswer: 1,
        marks: 1,
        testSet: 1
    }
];

// Function to seed questions
const seedQuestions = async () => {
    try {
        await connectDB();

        // Clear existing questions for test set 1
        await AptitudeQuestion.deleteMany({ testSet: 1 });
        console.log('Cleared existing questions for test set 1');

        // Insert new questions
        const result = await AptitudeQuestion.insertMany(sampleQuestions);
        console.log(`Successfully inserted ${result.length} aptitude questions for test set 1`);

        // Display summary
        console.log('\nQuestion Summary:');
        console.log('- Quantitative Aptitude: 8 questions');
        console.log('- Logical Reasoning: 6 questions');
        console.log('- Verbal Ability: 6 questions');
        console.log('Total: 20 questions');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding questions:', error);
        process.exit(1);
    }
};

// Run the seed function
seedQuestions();
