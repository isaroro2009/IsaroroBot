const HF_TOKEN = "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"; // pega tu token aquí
const API_URL = "https://api-inference.huggingface.co/models/DeepESP/gpt2-spanish";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("sendBtn").addEventListener("click", async () => {
    const input = document.getElementById("userInput").value;
    if (!input) return;

    const messagesDiv = document.getElementById("messages");

    // Mensaje del usuario
    const userMsg = document.createElement("div");
    userMsg.className = "message user";
    userMsg.textContent = input;
    messagesDiv.appendChild(userMsg);

    // Respuesta del bot con IA real
    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: input }),
      });

      const data = await response.json();
      const botMsg = document.createElement("div");
      botMsg.className = "message bot";
      botMsg.textContent = data[0]?.generated_text || "No pude responder 😔";
      messagesDiv.appendChild(botMsg);
    } catch (error) {
      const botMsg = document.createElement("div");
      botMsg.className = "message bot";
      botMsg.textContent = "Error al conectar con Hugging Face 😔";
      messagesDiv.appendChild(botMsg);
    }

    document.getElementById("userInput").value = "";
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
});
