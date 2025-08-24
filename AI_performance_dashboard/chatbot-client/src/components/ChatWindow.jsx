import { useEffect, useRef} from "react";
import { ChevronDown } from "lucide-react"; // import arrow icon

// Accepts a prop called "messages" which is an array of chat messages
function ChatWindow({ messages}) {

    const chatWindowRef = useRef(null);

    // Scroll to bottom of the chat window when button is clicked
    const ScrollToBottom = () => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTo({
                top: chatWindowRef.current.scrollHeight,
                behavior: "smooth",

            });
        }
    };

    return (
        <div className="chat-window-container">
            <div ref={chatWindowRef} className = "chat_window"> {/* Container for all chat messages */}
                {/*   iterates over the messages using .map() 
                -  for each msg, it creates a div with a class based on the role (user or bot) 
                -  "i" is the index of current message in the array, used as key */}
                {messages.map((msg, i) => (
                    // each message gets a key
                    // The className is dynamically set based on the role of the message
                    <div key= {i} className = {`message ${msg.role}`}>
                        {/* displays "You" for user messages and "Gemini" for bot messages
                        -   wrapped in a strong tag for bold formatting
                        - Ternary operator sytax: condition ? valueIfTrue : valueIfFalse */}
                        <strong>{msg.role === "user" ? "You" : "Mimo"}:</strong>{" "} 
                        {/*displays the content of the message*/}
                        {msg.content}
                    </div>
                ))}
            </div>

            {/* Button to scroll to bottom of chat window */}
            <button className = "scroll-button" onClick={ScrollToBottom}>
                <ChevronDown size = {24} />
            </button>
        </div>        
    );
}

export default ChatWindow;

