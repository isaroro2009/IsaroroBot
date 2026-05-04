export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Método no permitido" });
  }

  try {
    const { message } = req.body; // ✅ en Next.js se usa req.body

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

    const data = await response.json();
    return res.status(200).json({ reply: data.choices?.[0]?.message?.content || "No pude responder 😔" });
  } catch (error) {
    return res.status(500).json({ reply: "Error interno en el backend 😔", error: error.message });
  }
}
