export default async function handler(req, res) {
  const userMessage = req.query.message || "Hola";

  const response = await fetch(
    "https://api-inference.huggingface.co/models/DeepESP/gpt2-spanish",
    {
      headers: {
        Authorization: "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",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ inputs: userMessage }),
    }
  );

  const data = await response.json();
  res.status(200).json({ reply: data[0]?.generated_text || "No pude responder 😅" });
}
