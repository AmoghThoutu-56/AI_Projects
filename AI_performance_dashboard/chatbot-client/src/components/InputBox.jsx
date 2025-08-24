
import { useState } from "react";

// recieves a prop called "onSend"
// onSend is a callback function to send user messages
function InputBox({ onSend }) {

    // State to hold the input value
    // input => the current value of the input box
    // setInput => a function to update the input state
    const [input, setInput] = useState("");

    // handleSubmit: triggered when the form is submitted
    const handleSubmit = (e) =>  {

        // e => the event object from the form submission
        // e.preventDefault() => prevents the default form submission behavior (refreshing the page)
        e.preventDefault();

        // prevent sending empty messages
        if (!input.trim()) return;

        // Calls the onSend function passed as a prop with the current input value
        onSend(input);

        // Resets the input state to an empty string after sending the message
        setInput("");

        // Resets the height of the textarea to min-height
        const textarea = document.querySelector('.input-box textarea');
        if (textarea) textarea.style.height = "5rem";
    };

    // renders the input box
    // Displays a form with an input field and a submit button
    // text input box bound to the input state
    return (
        <form onSubmit = {handleSubmit} className = "input-box">
            <textarea 
                type = "text"
                value = {input}
                // onChange updates the state as the user types
                onChange = {(e) => setInput (e.target.value)}
                // auto-resize the textarea based on content
                onInput={(e) => {
                    e.target.style.height = "auto"; // Reset height
                    e.target.style.height = `${e.target.scrollHeight}px`; // Set to scrollHeight
                }}
                placeholder = "Ask me anything..."
            />
            {/* Submit button to send the message */}
            <button type = "submit"> <span id='send'>Send</span></button>
        </form>
    );
}

export default InputBox;

