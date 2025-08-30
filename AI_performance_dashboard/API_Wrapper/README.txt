# Node.js MIddleware Server

# Author: Amogh Thoutu
# Github: https://github.com/AmoghThoutu-56/AI_Projects.git

This the API_Wrapper is a simple middleware server that intercepts messages to and from the React UI for analysis. The React
app sends the user messages to the middleware server, they are then forwared to the LLM API (Gemini in this case). The
responses from the LLM are recived by the middleware server, which are then passed on to the React frontend. This way there
is minimal latency added by the middleware server, while the LLM performnace metrics are calculated asynchronously. 

-----

# How to test the middleware server
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
- POST the userMessage from the React App to the Gemini LLM
- Added a 400 Bad request error is userMessage is missing, to prevent sending empty messages to the LLM
- Set the response type as text
- Safely extract the renponse text from the LLM API response using optional chaining in javascript, to 
  avoid errors if necessary properties are missing
- If properties are missing set default reply as "No Respnonse from LLM" 
- Send the LLM response to the React App in a JSON formmat
- If the LLM API call fails and the middleware cannot get a response, log the error, set the default reply to
  'Failed to fetch a response from LLM', and return a 500 Internal Server Error.
- Set the Middleware server to listen on the set PORT
