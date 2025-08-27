# React Chatbot UI

# Author: Amogh Thoutu
# Github: https://github.com/AmoghThoutu-56/AI_Projects.git
 
This is a simple React based chatbot user interface that allows users to type messages and display AI generated responses
from the Gemini API, via the middleware. The current version is designed to run locally on your browser using 'localhost'.

-------

# How to test front end:
- change current directory to ./chatbot-client/src 
- cmd: npm run dev -- --host
- Go to the given ipaddr on your browser

------

# File 'main.jsx'

'main.jsx' is the entry point for the react application, mounting the 'App' component inside the root element

# File 'App.jsx'

'App.jsx' is the main component of the chatbot UI. It manages the overall structure, message state, and message flow 
between the user and the bot.

Component Structure:

- Stores the chat messgaes using React's 'useState'.
- Renders the chatbot interface using two subcomponents:
	- 'chatWindow': Display chat history
	- 'InputBox': Input field for typing messages
- Manages message flow between user and bot

Features:

- Intialize with a welocome message
- Appends user and bot messages to chat history
- Sends the user message to the middleware server which then swnds it to the LLM API
- add a temporary message to the messages state to indicate the request has been sent
- added a isLoading boolean state to indicate if waiting for response, to stop the user from sending new messages
- sends the isLoading state as a prop to InputBox

# File 'ChatWindow.jsx'

'ChatWindow.jsx' is responsible for rendering all chat messages in a scrollable container.

 Message object structure:
- role: either "user" or "bot"
- content: text of the message


Implemented a button to scroll to the bottom of the chat messages
- the chatwindow is structured in such a way that the scroll button is contained in the chatwindow but doesn't scroll
  with the messages
 
# File 'InputBox.jsx'

'InputBox.jsx' renders the input field where the user types messages to send to the chatbot
 
Features:

- Takes the user input and calls the callback prop "OnSend" when the Send button is clicked
- clears input after submission
- the textarea expands and shrinks dynamically to fit content
- the textarea shrinks back to its original size after tyhe message is sent
- if the isLoading state is true, the send button is disabled to prevent sending new messages 

# File 'styles.css'

'styles.css' provides the core styling for the chatbot interface

Features:

- flexibility to different screen sizes using flex boxes
- differentiates user and bot messages by right aligning user messages and left aligining bot messages
- the message bubbles resize to fit content
- the width of the message bubbles is limited to 80% of the viewport width
- implemented button shrink animation when clicked
- implemented custom scrollbar
- limited the height of the textarea to 50% of the viewport height
- the send button is aligned to the right of the text area
- the send button does not change size with the textarea
- the send button is greyed out when disabled
 
