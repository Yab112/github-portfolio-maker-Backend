import dotenv from "dotenv";
import connectDB from "./config/dbConfig.js";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

(async () => {
    try {
        await connectDB(); 
        app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
    } catch (error) {
        console.error("Failed to connect to the database", error);
        process.exit(1);
    }
})();
