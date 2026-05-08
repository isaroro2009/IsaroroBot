const nameLoginBtn = document.getElementById("nameLoginBtn");
const userFooter = document.getElementById("userFooter");
const newChatBtn = document.getElementById("newChatBtn");
const chatList = document.getElementById("chatList");
const messages = document.getElementById("messages");
const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");

let currentUser = null;
let currentChatId = null;

// Lista de emojis para asignar
const emojis = ["🌸","🌈","⭐","🔥","🍀","🐱","🐶","🎵","💎","⚡","🦋","🌻"];
function getRandomEmoji() {
  return emojis[Math.floor(Math.random() * emojis.length)];
}

// Iniciar sesión con nombre
nameLoginBtn.addEventListener("click", () => {
  const nombre = prompt("Ingresa tu nombre:");
  if (nombre && nombre.trim() !== "") {
    const emoji = getRandomEmoji();
    currentUser = `${emoji} ${nombre}`;
    userFooter.textContent = "👤 " + currentUser;
    alert("Bienvenido " + currentUser + " 💕");
    loadChats();
  }
});

// Crear chat
newChatBtn.addEventListener("click", () => {
  if (!currentUser) return alert("Primero inicia sesión con tu nombre ✨");
  const chatId = "chat_" + Date.now();
  const chatData = { id: chatId, owner: currentUser, messages: [], pinned: false, createdAt: new Date() };
  saveChat(chatData);
  loadChats();
});

// Guardar chat en localStorage (puedes cambiar a Firestore)
function saveChat(chat) {
  let chats = JSON.parse(localStorage.getItem("chats")) || [];
  chats.push(chat);
  localStorage.setItem("chats", JSON.stringify(chats));
}

// Cargar chats del usuario
function loadChats() {
  chatList.innerHTML = "";
  let chats = JSON.parse(localStorage.getItem("chats")) || [];
  chats.filter(c => c.owner === currentUser).forEach(chat => {
    const li = document.createElement("li");
    li.textContent = chat.id + " (" + new Date(chat.createdAt).toLocaleString() + ")";
    if (chat.pinned) li.classList.add("pinned");

    // Acciones
    const actions = document.createElement("div");
    actions.className = "chat-actions";

    const pinBtn = document.createElement("button");
    pinBtn.textContent = "📌";
    pinBtn.addEventListener("click", () => {
      chat.pinned = !chat.pinned;
      updateChat(chat);
      loadChats();
    });

    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️";
    delBtn.addEventListener("click", () => {
      deleteChat(chat.id);
      loadChats();
    });

    actions.appendChild(pinBtn);
    actions.appendChild(delBtn);
    li.appendChild(actions);

    li.addEventListener("click", () => openChat(chat.id));
    chatList.appendChild(li);
  });
}

function updateChat(chat) {
  let chats = JSON.parse(localStorage.getItem("chats")) || [];
  chats = chats.map(c => c.id === chat.id ? chat : c);
  localStorage.setItem("chats", JSON.stringify(chats));
}

function deleteChat(chatId) {
  let chats = JSON.parse(localStorage.getItem("chats")) || [];
  chats = chats.filter(c => c.id !== chatId);
  localStorage.setItem("chats", JSON.stringify(chats));
}

function openChat(chatId) {
  currentChatId = chatId;
  messages.innerHTML = "";
  let chats = JSON.parse(localStorage.getItem("chats")) || [];
  const chat = chats.find(c => c.id === chatId);
  chat.messages.forEach(msg => {
    const bubble = document.createElement("div");
    bubble.className = msg.sender;
    bubble.textContent = msg.text;
    messages.appendChild(bubble);
  });
}

// Enviar mensaje
sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
});

function sendMessage() {
  const text = userInput.value.trim();
  if (text !== "" && currentChatId) {
    const userBubble = document.createElement("div");
    userBubble.className = "user";
    userBubble.textContent = text;
    messages.appendChild(userBubble);

    let chats = JSON.parse(localStorage.getItem("chats")) || [];
    const chat = chats.find(c => c.id === currentChatId);
    chat.messages.push({ sender: "user", text });
    updateChat(chat);

    setTimeout(() => {
      const botText = "IsaBot 💕 dice: " + text + " 🌸✨";
      const botBubble = document.createElement("div");
      botBubble.className = "bot";
      botBubble.textContent = botText;
      messages.appendChild(botBubble);

      chat.messages.push({ sender: "bot", text: botText });
      updateChat(chat);

      messages.scrollTop = messages.scrollHeight;
    }, 600);

    userInput.value = "";
    messages.scrollTop = messages.scrollHeight;
  }
}
