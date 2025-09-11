import express from 'express';  
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleAuth } from 'google-auth-library';
import path from 'path';
import { fileURLToPath } from "url";
import { logChat } from "../../database/src/logChats.js";
import { connectToDB } from "../../database/src/connectDB.js";

// In node.js, import.meta.url gives the URL of the current module
// fileURLToPath converts the URL to a file path eg: file:///home/user/project/file.js to /home/user/project/file.js
// __filename gives the absolute path of the current file
// __dirname gives the directory name of the current module
const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); 


// Load environment variables from .env file (Port # and path of Google service account key file)
// __dirname is the absolute path of the current directory
// path.resolve is used to get the absolute path of the .env file by joining __dirname with ../../.env
// dotenv.config() loads the environment variables into process.env
// process.env is a global object that provides access to environment variables
const envPath  = path.resolve(__dirname, "../../.env")
dotenv.config({ path: envPath });

// throw an error if the .env file is not found or required variables are missing
if (!process.env.VITE_MIDDLEWARE_PORT || !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    throw new Error("Missing .env file or required environment variables");
}


// Initialize the express middleware server
const app = express();

// CORS is a security feature implemented by browsers to restrict web pages from making requests to a different domain than the one that served the web page.
// Since our React app and middleware server are running on different ports, we need to enable CORS in the middleware server
// to allow requests from the React app
// Here, we allow requests only from the React app's origin for security reasons
// REACT app is running on port 5173
app.use(cors({
  origin: "http://192.168.2.128:5173" // allow only your React app
}));


// parses incoming JSON requests in to Javascript objects
app.use(express.json());

// define the server port from the environment variable currenty set to 5000
// defining the ports allows us to run different servers on different ports on the same local machine
const PORT = process.env.VITE_MIDDLEWARE_PORT;

// Path to the Google service account key file (Oauth2 credentials)
// This file contains the credentials required to authenticate with Google Cloud services
//  **Make your own service account and download the key file from Google Cloud Console** 
// Set the path to the service account key file in the .env file
// GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/service-account-file.json
const ServiceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

// Set up Google Auth client for authenticating with Google Cloud services
// scopes define the level of access requested
// Here, we request access to the Generative Language API
// We set up the auth client once when the server starts to avoid re-initializing it for every request
// If there is an error in setting up the auth client, log the error and exit the process
let client;
(async () => {
    try {
        const auth = new GoogleAuth({
            keyfile: ServiceAccountPath,
            scopes: 'https://www.googleapis.com/auth/generative-language'
        });
        client = await auth.getClient();
    } catch (error) {
        console.error(" Error setting up Google Auth client:", error);
        process.exit(1);
    }
})();


// Connect to the MongoDB database
// connectToDB funtion is imported from database directory
// It returns the connection object which can be used to interact with the database
// let db will hold the connection object initally undefined
// using let allows us to assign the connection object later after the connection is established
let db;
(async () => {
    db = await connectToDB();
})();


// define the POST endpoint, which the React app will call to get LLM response
// endpoint is /api/chat
// async function to handle non-blocking calls
// req => request object containing data sent by the client (React app)
// res => response object to send data back to the client
app.post("/api/chat", async (req, res) => {

    // Extract userMessage from the request body
    // UserMessage is the message sent by the user from the React app
    // conversationId is the unique identifier for the chat session set in the React app
    const { userMessage, conversationId } = req.body;

    
    // If userMessage is missing, return a 400 Bad Request error
    // Just in case test, as currently there is a check in the React app to prevent sending empty messages
    if (!userMessage){
        return res.status(400).json({error: "userMessage is required"});
    }
    
    // Define the parameters for the Gemini API call
    const apiParams = {
        temperature: 0.7, // temperature controls the randomness of the output, where 2 is the most random
        maxOutputTokens: 1024, // maxOutputTokens defines the maximum length of the response
    }

    // Record the start time of the API call to measure latency
    const startTime = Date.now();

    try {

        // Define the Gemini API endpoint URL
        // This is the endpoint for the Gemini 1.5 flash model
        const url  = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
        
        // Define the model name for logging purposes
        // make sure it matches the model used in the API URL
        const modelName = "gemini-1.5-flash-latest";

        // Make a POST request to the Gemini API with the userMessage
        // The response contains the LLM's reply
        const response = await client.request({
            url,
            method: "POST",
            data: {
                // parts define the type of response requested
                // Here, we request a text response
                contents: [{ role: "user", parts: [{ text: userMessage }] }],
                generationConfig: {
                    // set the parameters defined in apiParams
                    temperature: apiParams.temperature, 
                    maxOutputTokens: apiParams.maxOutputTokens, 
                },

            },
        });
        
        // Record the reply time 
        const replyTime = Date.now(); 
       

        // Extract the bot's reply from the API response
        const data = response.data;


        // Safely access nested properties using optional chaining
        // optional chaining (?.) checks if the property exists before accessing, 
        // it prevents errors if any property in the chain is undefined, null, 0, "", false
        // ex: candidates[0] => first candidate response
        // text => the actual response text from the LLM
        // If any property is missing, the botMessage will be set to "No response from LLM"
        // The extected API response structure is:
        // {
        //   "candidates": [
        //     {
        //       "content": {
        //         "parts": [
        //           {
        //             "text": "This is the response text."
        //           }
        //         ]
        //       }
        //     }
        //   ]
        // }
        const botMessage = 
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No response from LLM";


        // Send the bot's reply back to the React app
        // The response is sent as a JSON object with a "reply" property
        // ex: { reply: "This is the response text." }
        res.json({ reply: botMessage});

        // tokenUsage object to log the token usage details
        // If usageMetadata or any property is missing, default to -1
        const tokenUsage = {
            input: data?.usageMetadata?.promptTokenCount || -1,
            output: data?.usageMetadata?.candidatesTokenCount || -1,
            total: data?.usageMetadata?.totalTokenCount || -1,
        };

        // Log the chat details to the database using the imported logChat function
        // logChat is an async function, so we await its completion
        // Any errors in logging will be caught and logged within the logChat function
        await logChat(
            // Mandatory parameters
            conversationId, 
            userMessage, 
            botMessage,
            startTime,
            replyTime,
            modelName,
            // optional parameters, missing properties will default to {} in logChat function or -1 in the schema
            { tokenUsage, 
                apiParams, 
            }
         );
        
 
      

    // catch any errors that occur during the API call such as:
    // network issues, invalid responses, authentication errors, etc.
    } catch (error) {
        // Log the error to the console for debugging
        console.error( "LLM API Error:", error);

        // Send a 500 Internal Server Error response back to the React app
        res.status(500).json({ error: "Failed to fetch response from LLM" });
    }
})

// Start the middleware server and listen on the defined port
// log the server URL to the console
app.listen(PORT, () => {
    console.log(`Middleware server running at http://192.168.2.128:${PORT}`);
})

