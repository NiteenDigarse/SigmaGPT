import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {

    const {
        prompt,
        setPrompt,
        reply,
        setReply,
        currThreadId,
        setPrevChats,
        setNewChat
    } = useContext(MyContext);

    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const getReply = async () => {

        if (!prompt.trim()) return;

        setLoading(true);
        setNewChat(false);

        const userMessage = prompt;   // 🔥 store before clearing

        try {
            const response = await fetch(
                "https://sigmagpt-backend-iily.onrender.com/api/chat",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        message: userMessage,
                        threadId: currThreadId
                    })
                }
            );

            const res = await response.json();

            if (!response.ok) {
                console.log(res);
                setLoading(false);
                return;
            }

            // ✅ Directly append here (no dependency on useEffect)
            setPrevChats(prev => [
                ...prev,
                { role: "user", content: userMessage },
                { role: "assistant", content: res.reply }
            ]);

            setReply(res.reply);
            setPrompt("");

        } catch (err) {
            console.log(err);
        }

        setLoading(false);
    };


    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    };


    return (
        <div className="chatWindow">

            <div className="navbar">
                <span>SigmaGPT <i className="fa-solid fa-chevron-down"></i></span>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon">
                        <i className="fa-solid fa-user"></i>
                    </span>
                </div>
            </div>

            {isOpen &&
                <div className="dropDown">
                    <div className="dropDownItem">
                        <i className="fa-solid fa-gear"></i> Settings
                    </div>
                    <div className="dropDownItem">
                        <i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan
                    </div>
                    <div className="dropDownItem">
                        <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
                    </div>
                </div>
            }

            <Chat />

            <ScaleLoader color="#fff" loading={loading} />

            <div className="chatInput">
                <div className="inputBox">
                    <input
                        placeholder="Ask anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && getReply()}
                    />
                    <div id="submit" onClick={getReply}>
                        <i className="fa-solid fa-paper-plane"></i>
                    </div>
                </div>
                <p className="info">
                    SigmaGPT can make mistakes. Check important info.
                </p>
            </div>

        </div>
    );
}

export default ChatWindow;