import mongoose from "mongoose";

// Enable debugging only in development
if (process.env.NODE_ENV === 'development') {
    mongoose.set('debug', true);
}

const connectDB = async (retries = 15, delay = 5000) => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error("❌ MONGO_URI is not defined in the environment variables.");
        process.exit(1);
    }

    while (retries > 0) {
        try {
            console.log("Attempting to connect to MongoDB...");
            await mongoose.connect(uri);
            console.log("✅ MongoDB Connected");
            break;
        } catch (error) {
            console.error("❌ MongoDB connection error:", error);
            retries -= 1;
            console.log(`Retries left: ${retries}`);
            if (retries === 0) {
                console.error("❌ Exhausted all retries. Exiting...");
                process.exit(1);
            }
            await new Promise(res => setTimeout(res, delay));
        }
    }

    mongoose.connection.on('error', (err) => {
        console.error("❌ MongoDB connection error:", err);
    });

    process.on('SIGINT', async () => {
        await mongoose.connection.close();
        console.log("❎ MongoDB disconnected on app termination");
        process.exit(0);
    });
};


export default connectDB;
