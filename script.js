const OR_TOKEN = "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"; 
const API_URL = "https://isaroro-feygpe562-isarorostudio-7594s-projects.vercel.app/api/chat";

document.addEventListener("DOMContentLoaded", () => {
  const sendBtn = document.getElementById("sendBtn");
  const userInput = document.getElementById("userInput");
  const messagesDiv = document.getElementById("messages");

  async function sendMessage(text) {
    if (!text) return;

    // Mensaje del usuario
    const userMsg = document.createElement("div");
    userMsg.className = "message user";
    userMsg.textContent = text;
    messagesDiv.appendChild(userMsg);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OR_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct", // puedes cambiar el modelo
          messages: [{ role: "user", content: text }]
        })
      });

      const data = await response.json();
      const botMsg = document.createElement("div");
      botMsg.className = "message bot";
      botMsg.textContent = data.choices?.[0]?.message?.content || "No pude responder 😔";
      messagesDiv.appendChild(botMsg);
    } catch (error) {
      const botMsg = document.createElement("div");
      botMsg.className = "message bot";
      botMsg.textContent = "Error al conectar con OpenRouter 😔";
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
