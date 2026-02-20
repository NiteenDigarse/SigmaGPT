import dotenv from "dotenv";

dotenv.config();

const getOpenAIAPIResponse = async (message) => {
    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",   // ✅ WORKING MODEL
                messages: [
                    { role: "user", content: message }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();

        if (!data.choices) {
            console.log("Groq API Error:", data);
            return "AI response failed.";
        }

        return data.choices[0].message.content;

    } catch (err) {
        console.log("Groq Fetch Error:", err);
        return "Server error occurred.";
    }
};

export default getOpenAIAPIResponse;