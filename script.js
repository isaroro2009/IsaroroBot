const API_URL = "https://isaroro-feygpe562-isarorostudio-7594s-projects.vercel.app/api/chat";

document.addEventListener("DOMContentLoaded", () => {
  const sendBtn = document.getElementById("sendBtn");
  const userInput = document.getElementById("userInput");
  const messagesDiv = document.getElementById("messages");

  async function sendMessage(text) {
    if (!text) return;

    const userMsg = document.createElement("div");
    userMsg.className = "message user";
    userMsg.textContent = text;
    messagesDiv.appendChild(userMsg);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });

      const data = await response.json();
      const botMsg = document.createElement("div");
      botMsg.className = "message bot";
      botMsg.textContent = data.reply;
      messagesDiv.appendChild(botMsg);
    } catch (error) {
      const botMsg = document.createElement("div");
      botMsg.className = "message bot";
      botMsg.textContent = "Error al conectar con el backend 😔";
      messagesDiv.appendChild(botMsg);
    }

    userInput.value = "";
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  sendBtn.addEventListener("click", () => sendMessage(userInput.value.trim()));
  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage(userInput.value.trim());
  });
});
