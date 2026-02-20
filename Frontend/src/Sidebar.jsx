import "./Sidebar.css";
import logo from "./assets/blacklogo.png";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {

    const {
        allThreads,
        setAllThreads,
        currThreadId,
        setNewChat,
        setPrompt,
        setReply,
        setCurrThreadId,
        setPrevChats
    } = useContext(MyContext);

    // ✅ Get All Threads
    const getAllThreads = async () => {
        try {
            const response = await fetch(
                "https://sigmagpt-backend.onrender.com/api/thread"
            );

            const res = await response.json();

            const filteredData = res.map(thread => ({
                threadId: thread.threadId,
                title: thread.title
            }));

            setAllThreads(filteredData);

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId]);


    // ✅ Create New Chat
    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    };


    // ✅ Change Thread
    const changeThread = async (newThreadId) => {

        setCurrThreadId(newThreadId);

        try {
            const response = await fetch(
                `https://sigmagpt-backend.onrender.com/api/thread/${newThreadId}`
            );

            if (!response.ok) return;

            const res = await response.json();

            setPrevChats(res);
            setNewChat(false);
            setReply(null);

        } catch (err) {
            console.log(err);
        }
    };


    // ✅ Delete Thread
    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(
                `https://sigmagpt-backend.onrender.com/api/thread/${threadId}`,
                { method: "DELETE" }
            );

            if (!response.ok) return;

            setAllThreads(prev =>
                prev.filter(thread => thread.threadId !== threadId)
            );

            if (threadId === currThreadId) {
                createNewChat();
            }

        } catch (err) {
            console.log(err);
        }
    };


    return (
        <section className="sidebar">

            {/* ✅ Logo + New Chat Button */}
            <button onClick={createNewChat}>
                <img src={logo} alt="gpt logo" className="logo" />
                <span>
                    <i className="fa-solid fa-pen-to-square"></i>
                </span>
            </button>


            {/* ✅ Chat History */}
            <ul className="history">
                {allThreads?.map((thread, idx) => (
                    <li
                        key={idx}
                        onClick={() => changeThread(thread.threadId)}
                        className={
                            thread.threadId === currThreadId
                                ? "highlighted"
                                : ""
                        }
                    >
                        {thread.title}

                        <i
                            className="fa-solid fa-trash"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteThread(thread.threadId);
                            }}
                        ></i>
                    </li>
                ))}
            </ul>


            {/* ✅ Footer */}
            <div className="sign">
                <p>By Niteen Digarse &hearts;</p>
            </div>

        </section>
    );
}

export default Sidebar;