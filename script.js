const API_URL = "https://isa-bot-nine.vercel.app/api/chat"; 
// Cambia por tu backend en Vercel

document.addEventListener("DOMContentLoaded", () => {
  const askBtn = document.querySelector(".ask-btn");
  const main = document.querySelector(".main");

  // Crear contenedor del chat
  const chatBox = document.createElement("div");
  chatBox.className = "chat-box";
  chatBox.innerHTML = `
    <div class="messages" id="messages"></div>
    <div class="input-area">
      <input id="userInput" type="text" placeholder="Escribe tu mensaje...">
      <button id="sendBtn">Enviar</button>
    </div>
  `;
  chatBox.style.display = "none"; // oculto al inicio
  main.appendChild(chatBox);

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
