const HF_TOKEN = "TU_TOKEN_DE_HUGGINGFACE"; // aquí va tu token
const API_URL = "https://api-inference.huggingface.co/models/DeepESP/gpt2-spanish";

async function sendMessage(message) {
  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${HF_TOKEN}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ inputs: message }),
  });
  const data = await response.json();
  return data[0]?.generated_text || "No pude responder 😔";
}
