const HF_TOKEN = "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"; // pega tu token aquí
const API_URL = "https://api-inference.huggingface.co/models/DeepESP/gpt2-spanish";

document.addEventListener("DOMContentLoaded", () => {
  const sendBtn = document.getElementById("sendBtn");
  const userInput = document.getElementById("userInput");
  const messagesDiv = document.getElementById("messages");
  const fileInput = document.getElementById("fileInput");

  async function sendMessage(text) {
    if (!text) return;

    // Mensaje del usuario
    const userMsg = document.createElement("div");
    userMsg.className = "message user";
    userMsg.textContent = text;
    messagesDiv.appendChild(userMsg);

    // Respuesta del bot con IA real
    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: text }),
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

    userInput.value = "";
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  sendBtn.addEventListener("click", () => sendMessage(userInput.value.trim()));

  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage(userInput.value.trim());
    }
  });

  // Funcionalidad del botón ➕
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
      const fileMsg = document.createElement("div");
      fileMsg.className = "message user";
      fileMsg.textContent = `📎 Archivo: ${file.name}`;
      messagesDiv.appendChild(fileMsg);
    }
  });
});
