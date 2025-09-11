import mongoose from "mongoose";
import crypto from "crypto";
import {v4 as uuidv4} from "uuid";

// Function to hash messages using HMAC with SHA-256
// Takes the message and a secret key as inputs
// Returns the hashed message in hexadecimal format
// HMAC stands for Hash-based Message Authentication Code
// SHA-256 is a cryptographic hash function that produces a fixed 256-bit hash value for any length input
// update() method processes the input data and digest() method calculates the hash in hex format
function hashMessage(message, secretKey) {
 return crypto
    .createHmac('sha256', secretKey)
    .update(message)
    .digest('hex');
}

// Define the schema for chat documents in MongoDB
// A schema defines the structure of the documents, default values, and validation rules
// Each chat document represents a single interaction between the user and the LLM
const chatSchema = new mongoose.Schema({
    
    // Unique identifier for the chat session
    // Validation rules: must be a string, is required, and indexed for faster queries
    conversationId: {
        type: String,
        required: true,
        index: true,
    },

    // Unique identifier for each message within a conversation
    // Default value is generated using uuidv4 to ensure uniqueness
    messageId: {
        type: String,
        required: true,
        unique: true,
        default: uuidv4,
    },

    // Details of the user's message
    // raw: the original message text
    // hashed: the hashed version of the message for privacy
    // charLength: the length of the raw message in characters, calculated using a default function
    // timestamp: the time when the message was sent, required field
    userMessage: {
        raw: { type: String, required: true },
        hashed: { type: String, required: true},
        charLength: {type: Number, default: function() { return this.userMessage.raw.length; }},
        timeStamp: { type: Date, required: true },
    },

    // Details of the LLM's response
    // raw: the original response text
    // hashed: the hashed version of the response for privacy
    // charLength: the length of the raw response in characters, calculated using a default function
    // timestamp: the time when the response was received, required field
    llmResponse: {
        raw: { type: String, required: true },
        hashed: { type: String, required: true },
        charLength: { type: Number, default: function() { return this.llmResponse.raw.length; }},
        timeStamp: { type: Date, required: true },
    },

    // Token usage details (optional)
    // input: number of tokens in the user's message
    // output: number of tokens in the LLM's response
    // total: total number of tokens used in the interaction
    // Default values are set to -1 to indicate unknown usage if not provided
    tokenUsage: {
        input: { type: Number, default: -1 },
        output: { type: Number, default: -1 },
        total: { type: Number, default: -1 },
    },

    // Name of the LLM model used for generating the response
    // This field is required
    modelName: { type: String, required: true},

    // Parameters used in the API call to the LLM (optional)
    // Default values are set to -1 to indicate unknown parameters if not provided
    // temperature: controls randomness in the output
    // topP: (nucleus sampling) selects from the smallest possible set of tokens with a cumulative probability >= topP  (Fixed number of tokens / More deterministic output)
    // topK: limits the next token selection to the top K most probable tokens
    // max_tokens: maximum number of tokens to generate in the response
    // frequency_penality: penalizes new tokens based on their existing frequency in the text so far (frequency based penality)
    // presence_penality: penalizes new tokens based on whether they appear in the text so far (binary penality)
    apiParams: { 
        temperature: { type: Number, default: -1 },
        topP: { type: Number, default: -1 },
        topK: { type: Number, default: -1 },
        max_tokens: { type: Number, default: -1 },
        frequency_penality: { type: Number, default: -1 },
        presence_penality: { type: Number, default: -1 },
    },

    // Performance metrics of the LLM response (optional)
    // latencyMs: time taken to receive the response in milliseconds
    // speedTokensPerMin: speed of response generation in tokens per minute
    // Default values are set to -1 to indicate unknown metrics if not provided
    performanceMetrics: {
        latencyMs: { type: Number, default: -1 },
        speedTokensPerMin: { type: Number, default: -1 },
    },
},
{
    timestamps: true, // Automatically adds createdAt and updatedAt fields
}
);

const chat = mongoose.model("Chat", chatSchema);

export { chat, hashMessage };


    
    

    
    