import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {

    const [input, setInput] = useState("");
    const [recentPrompt, setRecentprompt] = useState("");
    const [prevPrompts, setPrevprompts] = useState([]);
    const [showResult, setShowresult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultdata] = useState("");

    const delayPara = (index, nextword) => {
        setTimeout(function () {
            setResultdata(prev => prev + nextword);

        }, 75 * index)
    }

    const newChat =()=> {
        setLoading(false)
        setShowresult(false)
    }

    const onSent = async (prompt) => {

        setResultdata("")
        setLoading(true)
        setShowresult(true)
        let response;
        if (prompt !== undefined) {
            response = await runChat(prompt)
            setRecentprompt(prompt)
        } else {
            setPrevprompts(prev => [...prev, input])
            setRecentprompt(input)
            response = await runChat(input)
        }


        let responseArray = response.split("**");
        let newResponse = "";

        for (let i = 0; i < responseArray.length; i++) {
            if (i === 0 || i % 2 !== 1) {
                newResponse += responseArray[i];
            }
            else {
                newResponse += "<b>" + responseArray[i] + "</b> ";
            }
        }

        let newResponse2 = newResponse.split("*").join("<br/>");
        let newResponseArray = newResponse2.split(" ");
        for (let i = 0; i < newResponseArray.length; i++) {
            const nextWord = newResponseArray[i];
            delayPara(i, nextWord + " ")
        }
        setLoading(false)
        setInput("")
    }


    const contextValue = {
        prevPrompts,
        setPrevprompts,
        onSent,
        setRecentprompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat

    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;