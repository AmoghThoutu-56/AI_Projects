import { useEffect, useState } from 'react' // Importing React's useState hook to manage state in the component
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

  // handleSend: triggred when user sends a message
  // userMessage => the message sent by the user
  // Adds the user message to the messages array
  // Updates the state using setMessages()

  const handleSend = (userMessage) => {
    const newMessages = [...messages, { role: "user", content: userMessage }];

    // Simulate bot response
    newMessages.push({ role: "bot", content: "Thinking ..."});

    setMessages(newMessages);

    // TODO: call backend API to get response to replace "Thinking ..."

  };
  
  
  // renders the chatbot UI
  // Displays the chat window and input box
  // Sends messages to ChatWindow as props
  // Sends handleSend function to InputBox renamed as onSend prop
  return (
    <div className="app">
      <h2>LLM Performance Tracker</h2>
      <ChatWindow messages={messages} />
      <InputBox onSend={handleSend} />
    </div>
  );

}

export default App;

