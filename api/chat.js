export default async function handler(req, res) {
  try {
    const { message } = await req.json();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [{ role: "user", content: message }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ reply: `Error: ${errorText}` });
    }

    const data = await response.json();
    res.status(200).json({ reply: data.choices?.[0]?.message?.content || "No pude responder 😔" });
  } catch (error) {
    res.status(500).json({ reply: "Error interno en el backend 😔" });
  }
}
