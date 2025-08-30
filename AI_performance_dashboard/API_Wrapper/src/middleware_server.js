import express from 'express';  
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleAuth } from 'google-auth-library';
import path from 'path';

// Load environment variables from .env file (Port # and path of Google service account key file)
// path.resolve is used to get the absolute path of the .env file
// dotenv.config() loads the environment variables into process.env
// process.env is a global object that provides access to environment variables
const envPath  = path.resolve("../.env")
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


// define the POST endpoint, which the React app will call to get LLM response
// endpoint is /api/chat
// async function to handle non-blocking calls
// req => request object containing data sent by the client (React app)
// res => response object to send data back to the client
app.post("/api/chat", async (req, res) => {

    // Extract userMessage from the request body
    // UserMessage is the message sent by the user from the React app
    // Destructuring assignment to extract userMessage
    const { userMessage } = req.body;

    
    // If userMessage is missing, return a 400 Bad Request error
    // Just in case test, as currently there is a check in the React app to prevent sending empty messages
    if (!userMessage){
        return res.status(400).json({error: "userMessage is required"});
    }
    
    // Use GoogleAuth to authenticate with Google Cloud services using the service account key file
    // scopes define the level of access requested
    // Here, we request access to the Generative Language API
    try {
        const auth = new GoogleAuth({
            keyFile: ServiceAccountPath,
            scopes: 'https://www.googleapis.com/auth/generative-language'
        });
        
        // Get the authenticated client
        // This client will be used to make requests to the Generative Language API
        const client = await auth.getClient();

        // Define the Gemini API endpoint URL
        // This is the endpoint for the Gemini 1.5 flash model
        const url  = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

        // Make a POST request to the Gemini API with the userMessage
        // The response contains the LLM's reply
        const response = await client.request({
            url,
            method: "POST",
            data: {
                // parts define the type of response requested
                // Here, we request a text response
                contents: [{ role: "user", parts: [{ text: userMessage }] }]
            }
        });
        
        // Extract the bot's reply from the API response
        const data = response.data;
        
        // Safely access nested properties using optional chaining
        // optional chaining (?.) checks if the property exists before accessing, 
        // it prevents errors if any property in the chain is undefined or null
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

