const nameLoginBtn = document.getElementById("nameLoginBtn");
const userFooter = document.getElementById("userFooter");
const newChatBtn = document.getElementById("newChatBtn");
const chatList = document.getElementById("chatList");
const messages = document.getElementById("messages");
const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");

let currentUser = null;
let currentChatId = null;

// IP de tu Raspberry Pi 5 ejecutando el servidor de IA local con Flask
const IP_RASPBERRY = "http://192.168.80.31:5000/api/chat"; 

// Lista de emojis para asignar al usuario
const emojis = ["🌸","🌈","⭐","🔥","🍀","🐱","🐶","🎵","💎","⚡","🦋","🌻"];
function getRandomEmoji() {
  return emojis[Math.floor(Math.random() * emojis.length)];
}

// Control para abrir y cerrar el menú lateral deslizable
menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

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
  openChat(chatId); // Abre el chat automáticamente al crearlo
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
    li.textContent = "Chat " + new Date(chat.createdAt).toLocaleTimeString();
    if (chat.pinned) li.classList.add("pinned");

    // Acciones del chat (Pin y Borrar)
    const actions = document.createElement("div");
    actions.className = "chat-actions";

    const pinBtn = document.createElement("button");
    pinBtn.textContent = "📌";
    pinBtn.style.border = "none";
    pinBtn.style.background = "transparent";
    pinBtn.style.cursor = "pointer";
    pinBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Evita que se abra el chat al hacer clic en pin
      chat.pinned = !chat.pinned;
      updateChat(chat);
      loadChats();
    });

    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️";
    delBtn.style.border = "none";
    delBtn.style.background = "transparent";
    delBtn.style.cursor = "pointer";
    delBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Evita que se abra al borrar
      deleteChat(chat.id);
      loadChats();
      if (currentChatId === chat.id) {
        messages.innerHTML = "";
        currentChatId = null;
      }
    });

    actions.appendChild(pinBtn);
    actions.appendChild(delBtn);
    li.appendChild(actions);

    li.addEventListener("click", () => {
      openChat(chat.id);
      sidebar.classList.remove("open"); // Cierra la barra lateral al elegir chat en móviles
    });
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
  if (chat) {
    chat.messages.forEach(msg => {
      const bubble = document.createElement("div");
      bubble.className = msg.sender;
      bubble.textContent = msg.text;
      messages.appendChild(bubble);
    });
  }
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

// Enviar mensaje e interactuar con la API de la Raspberry Pi 5
async function sendMessage() {
  const text = userInput.value.trim();
  
  if (!currentChatId) {
    return alert("Por favor, selecciona o crea un chat en el panel lateral izquierdo primero ✨");
  }

  if (text !== "" && currentChatId) {
    // 1. Añadir mensaje del usuario en pantalla
    const userBubble = document.createElement("div");
    userBubble.className = "user";
    userBubble.textContent = text;
    messages.appendChild(userBubble);

    let chats = JSON.parse(localStorage.getItem("chats")) || [];
    const chat = chats.find(c => c.id === currentChatId);
    chat.messages.push({ sender: "user", text });
    updateChat(chat);

    userInput.value = "";
    messages.scrollTop = messages.scrollHeight;

    // 2. Añadir burbuja de carga simulada de IsaBot
    const thinkingBubble = document.createElement("div");
    thinkingBubble.className = "bot thinking";
    thinkingBubble.textContent = "IsaBot está pensando... 🌸✨";
    messages.appendChild(thinkingBubble);
    messages.scrollTop = messages.scrollHeight;

    try {
      // 3. Consulta POST a la Raspberry Pi 5 local
      const response = await fetch(IP_RASPBERRY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ mensaje: text })
      });

      const data = await response.json();
      
      if (messages.contains(thinkingBubble)) {
        messages.removeChild(thinkingBubble);
      }

      const botText = data.respuesta || "No obtuve una respuesta clara, inténtalo de nuevo 💕";

      // 4. Mostrar respuesta real de la IA
      const botBubble = document.createElement("div");
      botBubble.className = "bot";
      botBubble.textContent = botText;
      messages.appendChild(botBubble);

      chat.messages.push({ sender: "bot", text: botText });
      updateChat(chat);

    } catch (error) {
      console.error("Error al conectar con la Raspberry:", error);
      if (messages.contains(thinkingBubble)) {
        messages.removeChild(thinkingBubble);
      }

      const errorBubble = document.createElement("div");
      errorBubble.className = "bot error";
      errorBubble.textContent = "Ocurrió un error al intentar despertar a mi cerebro en la Raspberry Pi 5. 💔";
      messages.appendChild(errorBubble);
    }

    messages.scrollTop = messages.scrollHeight;
  }
}
