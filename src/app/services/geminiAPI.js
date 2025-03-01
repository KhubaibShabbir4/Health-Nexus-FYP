import axios from "axios";

// Fetch API key from environment variables
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables.");
}

// Define Gemini API endpoint
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

// Function to fetch response from Gemini API
export const fetchGeminiResponse = async (userMessage) => {
  try {
    const response = await axios.post(
      API_URL,
      {
        contents: [{ parts: [{ text: userMessage }] }],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Gemini API Response:", response.data);
    
    // Extract the text response
    const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't understand that.";
    return formatResponse(rawText);
  } catch (error) {
    console.error("Error fetching response from Gemini API:", error.response?.data || error.message);
    return "Sorry, there was an error processing your request.";
  }
};
const formatResponse = (text) => {
  if (!text) return "No response available."; // Handle empty input

  // Trim extra spaces
  let formattedText = text.trim();

  // Ensure proper paragraph spacing (max two new lines)
  formattedText = formattedText.replace(/\n{2,}/g, "\n\n");

  // Ensure each bullet point starts on a new line
  formattedText = formattedText.replace(/(?:\s*[\n\r]?)?([•♦*-])\s+/g, "\n$1 "); 

  // Ensure proper sub-bullets appear indented
  formattedText = formattedText.replace(/(?:^|\n)\s{2,}[-•♦*] (.+)/g, "\n  ◦ $1");

  // Format bold text with clearer emphasis
  formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, "\n🔹 $1 🔹");

  // Format italic text naturally
  formattedText = formattedText.replace(/\*(.*?)\*/g, "_$1_");

  // Normalize excess spaces but preserve meaningful ones
  formattedText = formattedText.replace(/\s{3,}/g, "  ");

  return formattedText.trim(); // Trim again to remove any leading or trailing new lines
};


