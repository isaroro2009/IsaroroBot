const nameLoginBtn = document.getElementById("nameLoginBtn");
const userFooter = document.getElementById("userFooter");
const newChatBtn = document.getElementById("newChatBtn");
const chatList = document.getElementById("chatList");
const messages = document.getElementById("messages");
const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");

let currentUser = null;
let currentChatId = null;

// COLOCO ESTA VARIABLE CON LA DIRECCIÓN DE TU RASPBERRY PI 5
// Cambia '192.168.x.x' por la dirección IP real de tu Raspberry Pi
const IP_RASPBERRY = "http://192.168.80.31:5000/api/chat"; 

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

// Guardar chat en localStorage
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
  messages.scrollTop = messages.scrollHeight;
}

// Enviar mensaje
sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
});

// FUNCIÓN MODIFICADA PARA PASAR EL MENSAJE A LA IA LOCAL
async function sendMessage() {
  const text = userInput.value.trim();
  if (text !== "" && currentChatId) {
    
    // 1. Pintar mensaje del usuario en la pantalla
    const userBubble = document.createElement("div");
    userBubble.className = "user";
    userBubble.textContent = text;
    messages.appendChild(userBubble);

    // Guardar en almacenamiento local
    let chats = JSON.parse(localStorage.getItem("chats")) || [];
    const chat = chats.find(c => c.id === currentChatId);
    chat.messages.push({ sender: "user", text });
    updateChat(chat);

    // Limpiar input y hacer scroll abajo
    userInput.value = "";
    messages.scrollTop = messages.scrollHeight;

    // 2. Crear burbuja temporal de "Pensando..." para que se vea interactivo
    const thinkingBubble = document.createElement("div");
    thinkingBubble.className = "bot thinking";
    thinkingBubble.textContent = "IsaBot está pensando... 🌸✨";
    messages.appendChild(thinkingBubble);
    messages.scrollTop = messages.scrollHeight;

    try {
      // 3. Petición POST HTTP directo a la Raspberry Pi 5
      const response = await fetch(IP_RASPBERRY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ mensaje: text })
      });

      const data = await response.get_json ? await response.get_json() : await response.json();
      
      // Eliminar burbuja de pensando
      messages.removeChild(thinkingBubble);

      // Obtener el texto que devolvió TinyLlama
      const botText = data.respuesta || "No obtuve una respuesta clara, inténtalo de nuevo 💕";

      // 4. Pintar respuesta real de la IA en la pantalla
      const botBubble = document.createElement("div");
      botBubble.className = "bot";
      botBubble.textContent = botText;
      messages.appendChild(botBubble);

      // Guardar mensaje de la IA en el historial
      chat.messages.push({ sender: "bot", text: botText });
      updateChat(chat);

    } catch (error) {
      console.error("Error al conectar con la IA de la Raspberry:", error);
      
      // Quitar burbuja de pensando
      if (messages.contains(thinkingBubble)) {
        messages.removeChild(thinkingBubble);
      }

      // Mostrar error amigable en la interfaz
      const errorBubble = document.createElement("div");
      errorBubble.className = "bot error";
      errorBubble.textContent = "Ocurrió un error al intentar despertar a mi cerebro en la Raspberry Pi 5. 💔";
      messages.appendChild(errorBubble);
    }

    messages.scrollTop = messages.scrollHeight;
  }
}
