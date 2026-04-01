export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Retrieve the API Key from Vercel Environment Variables
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Server Configuration Error: GEMINI_API_KEY is not set in Vercel." });
  }

  try {
    // Forward the POST request payload exactly as received to Gemini API
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body) 
    });

    const data = await response.json();
    
    // Pass the response seamlessly back to the client
    return res.status(response.status).json(data);

  } catch (error) {
    console.error("Gemini API Proxy Error:", error);
    return res.status(500).json({ error: "Failed to communicate with AI service." });
  }
}
