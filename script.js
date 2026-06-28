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

// URL del servidor Flask en Colab — actualiza esto cada vez que reinicies Colab
const ISABOT_URL = "https://anthem-enactment-exuberant.ngrok-free.dev/chat";

const emojis = ["🌸","🌈","⭐","🔥","🍀","🐱","🐶","🎵","💎","⚡","🦋","🌻"];
function getRandomEmoji() {
  return emojis[Math.floor(Math.random() * emojis.length)];
}

// ── AUTO LOGIN AL ABRIR LA PÁGINA ────────────────────────────────────────────
window.addEventListener("load", () => {
  // Ver si ya hay un usuario guardado
  const savedUser = localStorage.getItem("isabot_user");

  if (savedUser) {
    // Ya inició sesión antes — entrar directo
    currentUser = savedUser;
    userFooter.textContent = "👤 " + currentUser;
    loadChats();
    autoOpenOrCreateChat();
  } else {
    // Primera vez — pedir nombre con un modal bonito
    showLoginModal();
  }
});

function showLoginModal() {
  // Crear modal de bienvenida
  const modal = document.createElement("div");
  modal.id = "loginModal";
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(255,182,193,0.6); backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    z-index: 9999;
  `;

  modal.innerHTML = `
    <div style="
      background: white; border-radius: 30px; padding: 40px 35px;
      text-align: center; box-shadow: 0 10px 40px rgba(255,105,180,0.3);
      max-width: 360px; width: 90%;
    ">
      <div style="font-size: 3em; margin-bottom: 10px;">💕</div>
      <h2 style="color: #ff477e; margin: 0 0 8px 0; font-size: 1.6em;">¡Hola!</h2>
      <p style="color: #888; margin: 0 0 25px 0; font-size: 1em;">
        Soy IsaBot~ ¿Cómo te llamas? uwu 🌸
      </p>
      <input id="nameInput" type="text" placeholder="Tu nombre aquí..." style="
        width: 100%; padding: 14px 18px; border: 2px solid #ffd6eb;
        border-radius: 20px; font-size: 1em; outline: none;
        box-sizing: border-box; color: #555; margin-bottom: 15px;
        font-family: inherit;
      ">
      <button id="loginConfirmBtn" style="
        width: 100%; padding: 14px; background: linear-gradient(135deg, #ffd6eb, #e3c8ff);
        border: none; border-radius: 20px; font-size: 1em; font-weight: bold;
        color: #555; cursor: pointer; box-shadow: 0 4px 12px rgba(255,179,198,0.4);
        font-family: inherit;
      ">¡Empezar a chatear! ✨</button>
    </div>
  `;

  document.body.appendChild(modal);

  const nameInput = modal.querySelector("#nameInput");
  const confirmBtn = modal.querySelector("#loginConfirmBtn");

  nameInput.focus();

  function confirmarLogin() {
    const nombre = nameInput.value.trim();
    if (!nombre) {
      nameInput.style.border = "2px solid #ff477e";
      nameInput.placeholder = "¡Pon tu nombre! 🌸";
      return;
    }
    const emoji = getRandomEmoji();
    currentUser = `${emoji} ${nombre}`;
    localStorage.setItem("isabot_user", currentUser);
    userFooter.textContent = "👤 " + currentUser;
    modal.remove();
    loadChats();
    autoOpenOrCreateChat();
  }

  confirmBtn.addEventListener("click", confirmarLogin);
  nameInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") confirmarLogin();
  });
}

function autoOpenOrCreateChat() {
  // Buscar si ya hay chats del usuario
  let chats = JSON.parse(localStorage.getItem("chats")) || [];
  const userChats = chats.filter(c => c.owner === currentUser);

  if (userChats.length > 0) {
    // Abrir el chat más reciente
    const latest = userChats[userChats.length - 1];
    openChat(latest.id);
  } else {
    // Crear un chat nuevo automáticamente
    const chatId = "chat_" + Date.now();
    const chatData = {
      id: chatId,
      owner: currentUser,
      messages: [],
      pinned: false,
      createdAt: new Date()
    };
    saveChat(chatData);
    loadChats();
    openChat(chatId);

    // Mensaje de bienvenida de IsaBot
    setTimeout(() => {
      const welcomeBubble = document.createElement("div");
      welcomeBubble.className = "bot";
      const nombre = currentUser.split(" ").slice(1).join(" ");
      welcomeBubble.textContent = `¡Kyaa~ hola ${nombre}! 💕 Soy IsaBot, tu asistente kawaii ✨ ¿En qué puedo ayudarte hoy? 🌸`;
      messages.appendChild(welcomeBubble);
      messages.scrollTop = messages.scrollHeight;
    }, 300);
  }
}

// ── MENU LATERAL ─────────────────────────────────────────────────────────────
menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});



// ── CHATS ─────────────────────────────────────────────────────────────────────
newChatBtn.addEventListener("click", () => {
  if (!currentUser) return;
  const chatId = "chat_" + Date.now();
  const chatData = { id: chatId, owner: currentUser, messages: [], pinned: false, createdAt: new Date() };
  saveChat(chatData);
  loadChats();
  openChat(chatId);
  sidebar.classList.remove("open");
});

function saveChat(chat) {
  let chats = JSON.parse(localStorage.getItem("chats")) || [];
  chats.push(chat);
  localStorage.setItem("chats", JSON.stringify(chats));
}

function loadChats() {
  chatList.innerHTML = "";
  let chats = JSON.parse(localStorage.getItem("chats")) || [];
  chats.filter(c => c.owner === currentUser).forEach(chat => {
    const li = document.createElement("li");
    li.textContent = "Chat " + new Date(chat.createdAt).toLocaleTimeString();
    if (chat.pinned) li.classList.add("pinned");

    const actions = document.createElement("div");
    actions.className = "chat-actions";

    const pinBtn = document.createElement("button");
    pinBtn.textContent = "📌";
    pinBtn.style.cssText = "border:none;background:transparent;cursor:pointer;";
    pinBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      chat.pinned = !chat.pinned;
      updateChat(chat);
      loadChats();
    });

    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️";
    delBtn.style.cssText = "border:none;background:transparent;cursor:pointer;";
    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
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
      sidebar.classList.remove("open");
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

// ── ENVIAR MENSAJE ────────────────────────────────────────────────────────────
sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") { e.preventDefault(); sendMessage(); }
});

async function sendMessage() {
  const text = userInput.value.trim();
  if (!currentChatId || text === "") return;

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

  const thinkingBubble = document.createElement("div");
  thinkingBubble.className = "bot thinking";
  thinkingBubble.textContent = "IsaBot está pensando... 🌸✨";
  messages.appendChild(thinkingBubble);
  messages.scrollTop = messages.scrollHeight;

  try {
    const response = await fetch(ISABOT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true"
      },
      body: JSON.stringify({
        mensaje: text,
        historial: chat.messages.slice(0, -1).map(m => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.text
        }))
      })
    });

    const data = await response.json();
    if (messages.contains(thinkingBubble)) messages.removeChild(thinkingBubble);

    const botText = data.respuesta || "No obtuve respuesta, intenta de nuevo 💕";
    const botBubble = document.createElement("div");
    botBubble.className = "bot";
    botBubble.textContent = botText;
    messages.appendChild(botBubble);

    chat.messages.push({ sender: "bot", text: botText });
    updateChat(chat);

  } catch (error) {
    if (messages.contains(thinkingBubble)) messages.removeChild(thinkingBubble);
    const errorBubble = document.createElement("div");
    errorBubble.className = "bot error";
    errorBubble.textContent = "Kyaa~ no pude conectarme con mi cerebro en Colab 💔 ¿Está corriendo el servidor?";
    messages.appendChild(errorBubble);
  }

  messages.scrollTop = messages.scrollHeight;
}
