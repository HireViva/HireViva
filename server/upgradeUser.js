import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userModel from './models/userModel.js';

dotenv.config();

const upgradeUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = 'soumikjana01@gmail.com';
        
        const user = await userModel.findOneAndUpdate(
            { email },
            { 
                $set: { 
                    subscriptionTier: 'pro',
                    isSubscribed: true,
                    subscriptionStatus: 'active',
                    subscriptionStartDate: new Date(),
                    // Add 1 year for end date just in case
                    subscriptionEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
                } 
            },
            { new: true }
        );

        if (user) {
            console.log(`Successfully upgraded user ${email} to Pro tier.`);
            console.log(user);
        } else {
            console.log(`User with email ${email} not found.`);
        }
        
    } catch (error) {
        console.error('Error upgrading user:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

upgradeUser();
