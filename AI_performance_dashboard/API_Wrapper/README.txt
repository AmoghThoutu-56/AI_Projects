
# Node.js MIddleware Server
# Author: Amogh Thoutu
# Github: https://github.com/AmoghThoutu-56/AI_Projects.git

# Overview
This the API_Wrapper is a simple middleware server that intercepts messages to and from the React UI for analysis. The React
app sends the user messages to the middleware server, they are then forwared to the LLM API (Gemini in this case). The
responses from the LLM are recived by the middleware server, which are then passed on to the React frontend. This way there
is minimal latency added by the middleware server, while the LLM performnace metrics are calculated asynchronously. 

-----

# Design 
Minimizing latency is the primary design considearation, follwed by increased robustness. The following design choices were
made to schieve these goals:
 - using absolute paths iinstead of relative paths to locate the .env file, this way even if the script is moved to a different
   directory the fie paths are not broken
 - checking for the required environment variables before proceeding further
 - using custom port numbers to prevent any port conficts between the several services running simultaneously
 - the port numbers are set in the .env file so that the developer can check and modify port numbers for all services from
   a single location
 - setting up google authentication before the post requests ensures that the authetication is only perfomed once at startup
   and not every time a request is made, reducing overhead
 - Once the response is recieved from the LLM it is immediately sent to the React frontend and the databse logging is done 
   later. This futher reduces latency, as logging can be slow at times when the db is overloaded.
 - All calculations for metrics are done asyncronously by a seperate script again to reduce latency. 

-----

# Logging  
This module imports "connecTDB" and "logChat" and functions from database directory to:
- Start a new connection to the dB
- Log chats to dB

The following parameters regarding the API call are logged in the dB:
- startTime: the time at which the API request is sent by API_Wrapper
- replyTime: the time at which the API_Wrapper recieved a response from LLM
- temperature: to control the randomness/factuality of the response
- maxOutputTokens: to limit excessive token usage
- conversationID: to keep track of chat sessions
- userMessage: user query
- botMessage: LLM reply
- modelName: LLM model used to generate the response
- tokenUsage.input: number of tokens used for user query
- tokenUsage.output: number of tokens used for response
- tokenUsage.total: total number of tokens used input+response

-----

# How to start the middleware server
- change the current directory to ./API_Wrapper
- cmd: npm start
- test the middleware server directly using Curl or by sending messages through the React app

-----

#Prerequisites
- Obtain Oauth2 credintials from Google Cloud services for generative AI
- Download the .json file with credentials to the project directory
- Create an .env file or use the same one as the React app
- The .env file should contain the path to the .json credentials file and Middleware server port number

-----

#File: middleware_server.js
- Use express.js for HTML requests
- Load the .env file
- Throw an error if the .env file or necessary variables inside are missing
- Enable CORS on the server so that the React App can make cross origin requests
- Authenticate Google services credentials, failure resultis in exiting process
- Establish a connection to the MongoDB, failure results in exiting process
- Added a 400 Bad request error is userMessage is missing, to prevent sending empty messages to the LLM
- Define API Paramaters:
	- temperature:
	- max output tokens
- Get timestamp of POST request 
- Set the response type as text
- POST the userMessage from the React App to the Gemini LLM with the set parameters
- Get timestamp of the reply
- Safely extract the response text from the LLM API response using optional chaining in javascript, to 
  avoid errors if necessary properties are missing
- If properties are missing set default reply as "No Respnonse from LLM"
- Log token usage from the API response
- Send the LLM response to the React App in a JSON formmat
- Log the chat details to the dB using the imported logChat function 
- If the LLM API call fails and the middleware cannot get a response, log the error, set the default reply to
  'Failed to fetch a response from LLM', and return a 500 Internal Server Error.
- Set the Middleware server to listen on the set PORT
