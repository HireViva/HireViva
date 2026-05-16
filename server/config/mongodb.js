import mongoose from "mongoose";

const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        throw new Error('MONGODB_URI is not set');
    }

    mongoose.connection.on('connected', () => {
        console.log('MongoDB connected successfully');
    });

    mongoose.connection.on('error', (error) => {
        console.error('MongoDB connection error:', error.message);
    });

    await mongoose.connect(mongoUri);
};

export default connectDB;
