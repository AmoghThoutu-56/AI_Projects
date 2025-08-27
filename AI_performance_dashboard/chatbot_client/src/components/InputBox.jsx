
import { useState } from "react";

// recieves a prop called "onSend" from parent (App.jsx)
// onSend is a function defined in parent to send user messages to an LMM API
function InputBox({ onSend, isLoading }) {

    // define a state to hold the input value using useState react hook
    // input => the current value of the input box
    // setInput => a function to update the input state
    // Initialize input with an empty string
    const [input, setInput] = useState("");

    // handleSubmit: called when the form is submitted
    const handleSubmit = (e) =>  {

        // prevent default page reload on form submit
        e.preventDefault(); 

        // prevent sending empty messages or only whitespace
        // !input => checks if input is empty
        // .trim() => removes whitespace from both ends of the string
        if (!input.trim()) return;

        // Calls the onSend function passed as a prop with the current input value
        onSend(input);

        // Resets the input state to an empty string after sending the message
        setInput("");

        // Resets the height of the textarea to min-height after sending message
        // this is to account for input text area expanding to fit larger text
        // document.querySelector() => selects the first element that matches the CSS selector
        // .input_box textarea => selects the textarea inside the input_box class
        // if (textarea) => checks if the textarea element exists to avoid errors
        // textarea.style.height = "5rem" => sets the height of the textarea to 5rem
        const textarea = document.querySelector('.input_box textarea');
        if (textarea) textarea.style.height = "5rem";
    };

    // renders the input box
    // Displays a form with an input field and a submit button
    // text input box bound to the input state
    return (

        // form by deafault groups inputs and submit button and allows submission on Enter key press, 
        // after which the page refreshes
        // onSubmit is an event handler that calls handleSubmit function when form is submitted
        <form onSubmit = {handleSubmit} className = "input_box">

            {/* using a textarea instead of input to allow multi-line input
                - in a text area Enter key goes to a new line, overriding the default form submit feature
                - the form can only be submitted using the send button */}
            <textarea 
                type = "text"
                value = {input}

                // onChange updates the state as the user types
                onChange = {(e) => setInput (e.target.value)}

                // auto-resize the textarea based on content
                onInput={(e) => {

                    // decrease textarea height to automatically when text is deleted
                    e.target.style.height = "auto";

                    // set the text area height to scrollHeight to fit all content without scrollbar
                    //scrollHeight is the total height of the content, including the part not visible due to overflow
                    e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                placeholder = "Ask me anything..."
            />
            {/* Submit button to send the message 
                - type="submit" makes this button submit the form when clicked
                */}
            <button type = "submit" disabled = {isLoading}> 
                <span id='send'>Send</span></button>
        </form>
    );
}

export default InputBox;

