const API_URL = "https://isa-bot-nine.vercel.app/api/chat"; 
// Cambia por tu backend en Vercel

document.addEventListener("DOMContentLoaded", () => {
  const askBtn = document.querySelector(".ask-btn");
  const chatBox = document.getElementById("chatBox");

  // Mostrar chat al presionar el botón
  askBtn.addEventListener("click", () => {
    chatBox.style.display = "flex";
  });

  // Enviar mensaje
  document.getElementById("sendBtn").addEventListener("click", async () => {
    const input = document.getElementById("userInput").value;
    if (!input) return;

    const messagesDiv = document.getElementById("messages");

    // Mensaje del usuario
    const userMsg = document.createElement("div");
    userMsg.className = "message user";
    userMsg.textContent = input;
    messagesDiv.appendChild(userMsg);

    // Respuesta del bot
    try {
      const response = await fetch(`${API_URL}?message=${encodeURIComponent(input)}`);
      const data = await response.json();
      const botMsg = document.createElement("div");
      botMsg.className = "message bot";
      botMsg.textContent = data.reply;
      messagesDiv.appendChild(botMsg);
    } catch (error) {
      const botMsg = document.createElement("div");
      botMsg.className = "message bot";
      botMsg.textContent = "Error al conectar con IsaBot 😔";
      messagesDiv.appendChild(botMsg);
    }

    document.getElementById("userInput").value = "";
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
});
