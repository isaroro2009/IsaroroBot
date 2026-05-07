const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const messages = document.getElementById("messages");

sendBtn.addEventListener("click", () => {
  const text = userInput.value.trim();
  if (text !== "") {
    // Crear burbuja de usuario
    const userBubble = document.createElement("div");
    userBubble.className = "user";
    userBubble.textContent = text;
    messages.appendChild(userBubble);

    // Simular respuesta kawaii de IsaBot
    setTimeout(() => {
      const botBubble = document.createElement("div");
      botBubble.className = "bot";
      botBubble.textContent = "IsaBot 💕 dice: " + text + " 🌸✨";
      messages.appendChild(botBubble);
      messages.scrollTop = messages.scrollHeight;
    }, 600);

    userInput.value = "";
    messages.scrollTop = messages.scrollHeight;
  }
});
