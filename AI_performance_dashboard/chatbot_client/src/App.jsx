import { useState } from 'react' // Importing React's useState hook to manage state in the component
import ChatWindow from "./components/ChatWindow"; //a component to display chat messages
import InputBox from "./components/InputBox";     //a component to input user messages
import "./styles.css";


function App() {
  // State to hold chat messages
  // messages => an array to hold chat messages
  // Each message is an object with role (user or bot) and content (the message text)
  // setMessages => a function to update the messages state
  // Initialize with a welcome message
  const [messages, setMessages] = useState([ 
    {role: "bot", content: "Hello! How can I assist you today?"},
  ]);

  // State to indicate if a response is being fetched from the LLM
  // isLoading => a boolean to indicate loading state
  // setIsLoading => a function to update the isLoading state
  // Initialized to false
  const [isLoading, setIsLoading] = useState(false);
  
  //Function to call backend Gemini API to get LLM response
  // uses async for non-blocking calls
  // takes userMessage as input
  // returns the bot's reply or an error message
  const fetchLLMResponse = async (userMessage) => {
    try {

      // Call the middleware server which interacts with Gemini API
      // The middleware server is running on localhost:5000
      const response = await fetch( "http://localhost:5000/api/chat",
        {
          // POST request to send user message to the server
          method: "POST",
          headers: {

            // Specify JSON content type
            "Content-Type": "application/json", 
          },

          // Send userMessage in the request body as JSON
          body: JSON.stringify({ userMessage }), //
        });

      const data = await response.json();
      
      // Return the response from the middleware server
      // If the reply is successful, but it is a empty string or null, return "No response."
      return data.reply || "No response. ";
    } catch (error) {

      // Log any errors to the console
      console.error("Moddleware Error:", error);

      // Return an error message if the fetch fails due to network issues or server errors
      return " Error: Middleware unavailable.";
    }
  };

  // Function to handle sending user messages to the chatbot
  // takes userMessage as input
  // updates the messages state with user message and bot's temporary "Thinking..." message
  // sets loading state while waiting for LLM response to disable the send button
  // calls fetchLLMResponse to get the LLM reply
  const handleSend = async (userMessage) => {

    // Set loading state to true while fetching response
    setIsLoading(true);

    // Create a temporary messages array with the new user message and a placeholder bot message
    // This provides the user with immediate feedback while waiting for the LLM's response
    const tempMessages = [
      ...messages, // keep existing messages
      { role: "user" , content: userMessage},
      { role: "bot", content: "Thinking..."},
    ];

    // Update the messages state to include the new user message and placeholder bot message
    setMessages(tempMessages);

    // Fetch Gemini reesponse
    const botReply  = await fetchLLMResponse(userMessage);

    // Replace placeholder bot message with actual response
    // Update the messages state with the new user message and the actual LLM reply
    setMessages([
      ...messages,
      { role: "user", content: userMessage },
      { role: "bot", content: botReply },
    ]);

    // Set loading state to false after receiving the response
    setIsLoading(false);

  };     
  
  // renders the chatbot UI
  // Displays the chat window and input box
  // Sends messages to ChatWindow as props
  // Sends handleSend function to InputBox renamed as onSend prop
  // Passes isLoading state to InputBox to disable send button while waiting for LLM response
  return (
    <div className="app">
      <h2>LLM Performance Tracker</h2>
      <ChatWindow messages={messages} />
      <InputBox onSend={handleSend} isLoading = {isLoading}/>
    </div>
  );

}

export default App;

