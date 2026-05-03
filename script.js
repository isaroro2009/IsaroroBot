const API_URL = "https://api-inference.huggingface.co/models/DeepESP/gpt2-spanish";
const API_TOKEN = "TU_TOKEN_AQUI"; // Reemplaza con tu token de Hugging Face

async function sendMessage() {
  const input = document.getElementById("user-input").value;
  const chatBox = document.getElementById("chat-box");

  if (!input) return;

  chatBox.innerHTML += `<p><b>Tú:</b> ${input}</p>`;

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Authorization": `Bearer ${API_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ inputs: "Responde en español: " + input })
  });

  const data = await response.json();
  const botReply = data[0]?.generated_text || "Error al responder";

  chatBox.innerHTML += `<p><b>Bot:</b> ${botReply}</p>`;
  document.getElementById("user-input").value = "";
}
