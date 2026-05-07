const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const messages = document.getElementById("messages");
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const chatList = document.getElementById("chatList");
const newChatBtn = document.getElementById("newChatBtn");

// Función para enviar mensajes
function sendMessage() {
  const text = userInput.value.trim();
  if (text !== "") {
    // Crear burbuja de usuario
    const userBubble = document.createElement("div");
    userBubble.className = "user";
    userBubble.textContent = text;
    messages.appendChild(userBubble);

    // Guardar mensaje en el chat actual
    saveMessage("user", text);

    // Simular respuesta kawaii de IsaBot
    setTimeout(() => {
      const botBubble = document.createElement("div");
      botBubble.className = "bot";
      botBubble.textContent = "IsaBot 💕 dice: " + text + " 🌸✨";
      messages.appendChild(botBubble);

      // Guardar respuesta en el chat actual
      saveMessage("bot", botBubble.textContent);

      messages.scrollTop = messages.scrollHeight;
    }, 600);

    userInput.value = "";
    messages.scrollTop = messages.scrollHeight;
  }
}

// Click en botón
sendBtn.addEventListener("click", sendMessage);

// Enter en teclado
userInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
});

// ----------------------
// 📂 Gestión de chats
// ----------------------
let currentChatId = null;

// Abrir/cerrar menú lateral
menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  loadChats();
});

// Crear nuevo chat
newChatBtn.addEventListener("click", () => {
  const chatId = "chat_" + Date.now();
  localStorage.setItem(chatId, JSON.stringify([])); // chat vacío
  currentChatId = chatId;
  loadChats();
  messages.innerHTML = ""; // limpiar área de mensajes
});

// Guardar mensaje en el chat actual
function saveMessage(sender, text) {
  if (!currentChatId) {
    // Si no hay chat activo, crear uno nuevo
    currentChatId = "chat_" + Date.now();
    localStorage.setItem(currentChatId, JSON.stringify([]));
    loadChats();
  }
  const chatData = JSON.parse(localStorage.getItem(currentChatId)) || [];
  chatData.push({ sender, text });
  localStorage.setItem(currentChatId, JSON.stringify(chatData));
}

// Cargar lista de chats en el menú
function loadChats() {
  chatList.innerHTML = "";
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("chat_")) {
      const li = document.createElement("li");
      li.textContent = key.replace("chat_", "Chat ");
      li.addEventListener("click", () => openChat(key));
      chatList.appendChild(li);
    }
  }
}

// Abrir un chat guardado
function openChat(chatId) {
  currentChatId = chatId;
  messages.innerHTML = "";
  const chatData = JSON.parse(localStorage.getItem(chatId)) || [];
  chatData.forEach(msg => {
    const bubble = document.createElement("div");
    bubble.className = msg.sender;
    bubble.textContent = msg.text;
    messages.appendChild(bubble);
  });
  messages.scrollTop = messages.scrollHeight;
}
