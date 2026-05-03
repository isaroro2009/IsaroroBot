const HF_TOKEN = "TU_TOKEN_DE_HUGGINGFACE"; // pega aquí tu token
const API_URL = "https://api-inference.huggingface.co/models/DeepESP/gpt2-spanish";

document.addEventListener("DOMContentLoaded", () => {
  const askBtn = document.querySelector(".ask-bar"); // barra inferior
  const chatBox = document.getElementById("chatBox");
  const sendBtn = document.getElementById("sendBtn");
  const userInput = document.getElementById("userInput");
  const messagesDiv = document.getElementById("messages");

  // Mostrar la caja de chat al hacer clic en la barra inferior
  askBtn.addEventListener("click", () => {
    chatBox.style.display = "flex";
    askBtn.style.display = "none"; // ocultamos la barra para que quede solo el chat
  });

  // Función para enviar mensaje
  async function sendMessage() {
    const input = userInput.value.trim();
    if (!input) return;

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

    // limpiar input y hacer scroll
    userInput.value = "";
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  // Evento al hacer clic en enviar
  sendBtn.addEventListener("click", sendMessage);

  // Permitir enviar con Enter
  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });
});
