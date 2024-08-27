import mongoose from 'mongoose';

const connectToMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('---***Database Connected Successfully***---');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

export default connectToMongo;
