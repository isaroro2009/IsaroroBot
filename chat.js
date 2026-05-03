export default async function handler(req, res) {
  const userMessage = req.query.message || "Hola";

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/DeepESP/gpt2-spanish",
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: userMessage }),
      }
    );

    const data = await response.json();
    res.status(200).json({ reply: data[0]?.generated_text || "No pude responder 😅" });
  } catch (error) {
    res.status(500).json({ reply: "Error interno en IsaBot 😔" });
  }
}
