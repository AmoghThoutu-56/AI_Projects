import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
// using __dirname to get the absolute path of the current directory makes it work regardless of where the script is run from
const envPath = path.resolve(__dirname, "../../.env")
dotenv.config({ path: envPath });

// throw an error if the .env file is not found or required variables are missing
if( !process.env.MONGODB_PORT) {
    throw new Error(" Missing .env file or reuired environment variable: MONGODB_PORT");
}

// Get the MongoDB port from environment variables
const mongoPort = process.env.MONGODB_PORT;

// Function to connect to MongoDB using Mongoose
// Connects to the MongoDB instance running on localhost at the specified port
// Uses the database named 'llm_metrics'
// If the connection is successful, it logs a success message and returns the connection object
// If there is an error, it logs the error and exits the process
export async function connectToDB(){
    try {
        await mongoose.connect(`mongodb://192.168.2.128:${mongoPort}/llm_metrics`);

        console.log(` Connected to MongoDB at 192.2.168.128:${mongoPort}/llm_metrics`);

        // Event listeners for the mongoose connection
        // if the connection is disconnected mid session or there is an error, log it to the console
        mongoose.connection.on("disconnected", () => {
            console.error( " MongoDB disconnected!");
        });

        mongoose.connection.on("error", (err) => {
            console.error("MongoDB connection error:", err);
        }); 

        return mongoose.connection;

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

