const userFooter = document.getElementById("userFooter");
const newChatBtn = document.getElementById("newChatBtn");
const chatList = document.getElementById("chatList");
const messages = document.getElementById("messages");
const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");

// 🤖 Diseño del Robotsito Kawaii en código (SVG Rosa Pastel)
const KAWAII_ROBOT_SVG = `
<svg viewBox="0 0 100 100" width="35" height="35" style="flex-shrink:0;">
  <!-- Antena -->
  <circle cx="50" cy="12" r="5" fill="#ff477e"/>
  <line x1="50" y1="12" x2="50" y2="25" stroke="#ff477e" stroke-width="4"/>
  <!-- Cabeza Principal -->
  <rect x="20" y="25" width="60" height="50" rx="18" fill="#ffd6eb" stroke="#ff85a2" stroke-width="3"/>
  <!-- Orejitas / Tornillos -->
  <rect x="13" y="42" width="8" height="15" rx="3" fill="#ff85a2"/>
  <rect x="79" y="42" width="8" height="15" rx="3" fill="#ff85a2"/>
  <!-- Pantalla de los Ojos -->
  <rect x="28" y="34" width="44" height="24" rx="10" fill="#fff0f6"/>
  <!-- Ojitos Tiernos Anime (Felices ^_^) -->
  <path d="M 36 48 Q 41 40 44 48" stroke="#ff477e" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <path d="M 56 48 Q 59 40 64 48" stroke="#ff477e" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <!-- Mejillas Sonrojadas -->
  <circle cx="32" cy="54" r="4" fill="#ffa3c4" opacity="0.8"/>
  <circle cx="68" cy="54" r="4" fill="#ffa3c4" opacity="0.8"/>
  <!-- Boquita -->
  <path d="M 47 52 Q 50 55 53 52" stroke="#ff477e" stroke-width="2" fill="none" stroke-linecap="round"/>
</svg>
`;

// 🍔 Crear dinámicamente la Sección de la Galería DENTRO del Menú Hamburguesa (Sidebar)
const galleryContainer = document.createElement("div");
galleryContainer.id = "galleryContainer";
galleryContainer.style.cssText = `
  margin-top: auto; /* Lo empuja hacia la parte inferior del menú */
  padding-top: 15px;
  border-top: 2px dashed #ffd6eb;
`;
galleryContainer.innerHTML = `
  <h3 style="color: #ff477e; font-size: 1.1em; margin: 0 0 12px 0; display: flex; align-items: center; gap: 8px; font-family: inherit;">
    🖼️ Galería de Arte
  </h3>
  <div id="galleryGrid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; max-height: 180px; overflow-y: auto; padding-right: 4px;"></div>
`;
sidebar.appendChild(galleryContainer);

// 🔍 Crear dinámicamente el Modal para Previsualizar y Descargar Imágenes
const previewModal = document.createElement("div");
previewModal.id = "previewModal";
previewModal.style.cssText = `
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.7); backdrop-filter: blur(5px);
  display: none; align-items: center; justify-content: center;
  z-index: 10000; opacity: 0; transition: opacity 0.3s ease;
`;
previewModal.innerHTML = `
  <div style="
    background: white; border-radius: 25px; padding: 20px; max-width: 450px; width: 90%;
    text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.3); position: relative;
  ">
    <button id="closePreviewBtn" style="
      position: absolute; top: 15px; right: 15px; background: #ffd6eb; border: none;
      width: 30px; height: 30px; border-radius: 50%; font-weight: bold; color: #ff477e;
      cursor: pointer; font-size: 1em;
    ">✕</button>
    
    <h3 style="color: #ff477e; margin-top: 5px; margin-bottom: 15px; font-family: inherit;">✨ Previsualización ✨</h3>
    
    <img id="modalImage" src="" style="width: 100%; max-height: 400px; object-fit: contain; border-radius: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
    
    <a id="downloadImageBtn" download="isabot_art.jpg" href="#" style="
      display: inline-block; margin-top: 15px; width: 100%; padding: 12px;
      background: linear-gradient(135deg, #ffd6eb, #e3c8ff); border-radius: 15px;
      color: #555; text-decoration: none; font-weight: bold; box-shadow: 0 4px 12px rgba(255,179,198,0.4);
      box-sizing: border-box; font-family: inherit; transition: transform 0.1s;
    ">📥 Descargar Imagen</a>
  </div>
`;
document.body.appendChild(previewModal);

previewModal.querySelector("#closePreviewBtn").addEventListener("click", closeImageModal);
previewModal.addEventListener("click", (e) => {
  if (e.target === previewModal) closeImageModal();
});

function openImageModal(imgSrc) {
  const modalImage = document.getElementById("modalImage");
  const downloadImageBtn = document.getElementById("downloadImageBtn");
  modalImage.src = imgSrc;
  downloadImageBtn.href = imgSrc;
  previewModal.style.display = "flex";
  setTimeout(() => { previewModal.style.opacity = "1"; }, 10);
}

document.getElementById("downloadImageBtn").addEventListener("click", function() {
  this.style.transform = "scale(0.95)";
  setTimeout(() => this.style.transform = "scale(1)", 100);
});

function closeImageModal() {
  previewModal.style.opacity = "0";
  setTimeout(() => { previewModal.style.display = "none"; }, 300);
}

let currentUser = null;
let currentChatId = null;

const CLOUDFLARE_URL = "https://glad-entrepreneur-cancer-cdna.trycloudflare.com/chat";

const ISABOT_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" 
  ? "http://localhost:5001/chat" 
  : CLOUDFLARE_URL;

const emojis = ["🌸","🌈","⭐","🔥","🍀","🐱","🐶","🎵","💎","⚡","🦋","🌻"];
function getRandomEmoji() {
  return emojis[Math.floor(Math.random() * emojis.length)];
}

window.addEventListener("load", () => {
  const savedUser = localStorage.getItem("isabot_user");
  if (savedUser) {
    currentUser = savedUser;
    userFooter.textContent = "👤 " + currentUser;
    loadChats();
    autoOpenOrCreateChat();
    updateGallery(); 
  } else {
    showLoginModal();
  }
});

function showLoginModal() {
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
    updateGallery();
  }

  confirmBtn.addEventListener("click", confirmarLogin);
  nameInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") confirmarLogin();
  });
}

function autoOpenOrCreateChat() {
  let chats = JSON.parse(localStorage.getItem("chats")) || [];
  const userChats = chats.filter(c => c.owner === currentUser);

  if (userChats.length > 0) {
    const latest = userChats[userChats.length - 1];
    openChat(latest.id);
  } else {
    const chatId = "chat_" + Date.now();
    const chatData = { id: chatId, owner: currentUser, messages: [], pinned: false, createdAt: new Date() };
    saveChat(chatData);
    loadChats();
    openChat(chatId);

    setTimeout(() => {
      appendBotMessage(`¡Kyaa~ hola! 💕 Soy IsaBot, tu asistente kawaii ✨ ¿En qué puedo ayudarte hoy? 🌸`);
    }, 300);
  }
}

function updateGallery() {
  const galleryGrid = document.getElementById("galleryGrid");
  if (!galleryGrid) return;
  galleryGrid.innerHTML = "";

  let chats = JSON.parse(localStorage.getItem("chats")) || [];
  chats.filter(c => c.owner === currentUser).forEach(chat => {
    chat.messages.forEach(msg => {
      if (msg.type === "imagen") {
        const imgThumb = document.createElement("img");
        imgThumb.src = msg.text;
        imgThumb.style.cssText = `
          width: 100%; height: 60px; object-fit: cover; border-radius: 8px; 
          border: 1px solid #ffd6eb; cursor: pointer; transition: transform 0.2s;
        `;
        imgThumb.addEventListener("click", () => {
          openImageModal(msg.text);
        });
        galleryGrid.appendChild(imgThumb);
      }
    });
  });
}

menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

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
      updateGallery();
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

// ── BURBUJAS DEL BOT CON NUEVO AVATAR ANIME KAWAII ───────────────────────────
function appendBotMessage(content, isImage = false) {
  const container = document.createElement("div");
  container.style.cssText = "display: flex; align-items: flex-end; gap: 10px; margin-bottom: 14px; width: 100%; animation: fadeIn 0.3s ease;";

// Inyectar el nuevo diseño de robotsito rosa (Contenedor ampliado a 45px)
  const avatarContainer = document.createElement("div");
  avatarContainer.style.cssText = "width: 70px; height: 70px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;";
  avatarContainer.innerHTML = KAWAII_ROBOT_SVG;

  const bubble = document.createElement("div");
  bubble.className = "bot";
  bubble.style.margin = "0"; 

  if (isImage) {
    const img = document.createElement("img");
    img.src = content;
    img.style.cssText = "width: 100%; max-width: 280px; border-radius: 15px; margin-top: 5px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); cursor: pointer;";
    img.addEventListener("click", () => {
      openImageModal(content);
    });
    bubble.textContent = "¡Mira lo que pinté para ti! 🎨✨\n";
    bubble.appendChild(img);
  } else {
    bubble.textContent = content;
  }

  container.appendChild(avatarContainer);
  container.appendChild(bubble);
  messages.appendChild(container);
  messages.scrollTop = messages.scrollHeight;
  return container;
}

function openChat(chatId) {
  currentChatId = chatId;
  messages.innerHTML = "";
  let chats = JSON.parse(localStorage.getItem("chats")) || [];
  const chat = chats.find(c => c.id === chatId);
  if (chat) {
    chat.messages.forEach(msg => {
      if (msg.sender === "user") {
        const userBubble = document.createElement("div");
        userBubble.className = "user";
        userBubble.textContent = msg.text;
        messages.appendChild(userBubble);
      } else {
        appendBotMessage(msg.text, msg.type === "imagen");
      }
    });
  }
  messages.scrollTop = messages.scrollHeight;
}

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

  const thinkingContainer = appendBotMessage("IsaBot está creando magia... 🌸✨");

  try {
    const response = await fetch(ISABOT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mensaje: text,
        historial: chat.messages.slice(0, -1).map(m => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.type === "imagen" ? "[Imagen]" : m.text
        }))
      })
    });

    const data = await response.json();
    if (messages.contains(thinkingContainer)) messages.removeChild(thinkingContainer);

    if (data.tipo === "imagen") {
      appendBotMessage(data.respuesta, true);
      chat.messages.push({ sender: "bot", text: data.respuesta, type: "imagen" });
      updateChat(chat);
      updateGallery(); 
    } else {
      const botText = data.respuesta || data.response || data.text || "No obtuve respuesta, intenta de nuevo 💕";
      appendBotMessage(botText, false);
      chat.messages.push({ sender: "bot", text: botText });
      updateChat(chat);
    }

  } catch (error) {
    if (messages.contains(thinkingContainer)) messages.removeChild(thinkingContainer);
    const errorBubble = document.createElement("div");
    errorBubble.className = "bot error";
    errorBubble.textContent = "Kyaa~ no pude conectarme con mi cerebro de arte local 💔 ¿Encendiste el server.py?";
    messages.appendChild(errorBubble);
  }

  messages.scrollTop = messages.scrollHeight;
}
