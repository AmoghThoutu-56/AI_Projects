import { useEffect, useRef} from "react";
import { ChevronDown } from "lucide-react"; // import arrow icon

// Accepts a prop called "messages" from parent which is an array of chat messages
function ChatWindow({ messages}) {

    // chatWindowRef => useRef react hook to reference the chat_window div
    // useRef(null) => initializes the ref with null
    // This ref is used to access the DOM element directly for scrolling
    const chatWindowRef = useRef(null);

    // Scroll to bottom of the chat window when button is clicked
    // chatWindowRef.current => accesses the chat_window DOM node
    // scrollTo() => scrolls the chat window to the specified position
    // scrollHeight is the total height of the chat content
    // top: chatWindowRef.current.scrollHeight => scrolls to the bottom of the chat window
    const ScrollToBottom = () => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTo({
                top: chatWindowRef.current.scrollHeight,
                behavior: "smooth",

            });
        }
    };


    // Structure:
    // chat_window_container => main container div
    // chat_window => div that holds all chat messages
    // Only chat_window div is scrollable
    // placing the scroll button outside chat_window div so it stays fixed when scrolling
    // placing the button inside chat_window_container so it stays within the chat window area when it is resized
    return (
        <div className="chat_window_container">
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
                        <strong>{msg.role === "user" ? "You" : "Gemini"}:</strong>{" "} 
                        {/*displays the content of the message*/}
                        {msg.content}
                    </div>
                ))}
            </div>

            {/* Button to scroll to bottom of chat window
                - onClick is a event handler that calls the ScrollToBottom function when button is clicked
            */}
            <button className = "scroll-button" onClick={ScrollToBottom}>
                <ChevronDown size = {24} />
            </button>
        </div>        
    );
}

export default ChatWindow;

