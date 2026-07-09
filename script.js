const userFooter = document.getElementById("userFooter");
const newChatBtn = document.getElementById("newChatBtn");
const chatList = document.getElementById("chatList");
const messages = document.getElementById("messages");
const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");

// 🎭 Variable global para guardar la personalidad seleccionada (por defecto kawaii)
let botPersonality = localStorage.getItem("isabot_personality") || "kawaii";

// 🤖 Diseño del Robotsito Kawaii SVG Rosa Pastel
const KAWAII_ROBOT_SVG = `
<svg viewBox="0 0 100 100" width="35" height="35" style="flex-shrink:0;">
  <circle cx="50" cy="12" r="5" fill="#ff477e"/>
  <line x1="50" y1="12" x2="50" y2="25" stroke="#ff477e" stroke-width="4"/>
  <rect x="20" y="25" width="60" height="50" rx="18" fill="#ffd6eb" stroke="#ff85a2" stroke-width="3"/>
  <rect x="13" y="42" width="8" height="15" rx="3" fill="#ff85a2"/>
  <rect x="79" y="42" width="8" height="15" rx="3" fill="#ff85a2"/>
  <rect x="28" y="34" width="44" height="24" rx="10" fill="#fff0f6"/>
  <path d="M 36 48 Q 41 40 44 48" stroke="#ff477e" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <path d="M 56 48 Q 59 40 64 48" stroke="#ff477e" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <circle cx="32" cy="54" r="4" fill="#ffa3c4" opacity="0.8"/>
  <circle cx="68" cy="54" r="4" fill="#ffa3c4" opacity="0.8"/>
  <path d="M 47 52 Q 50 55 53 52" stroke="#ff477e" stroke-width="2" fill="none" stroke-linecap="round"/>
</svg>
`;

// ⚙️ Crear el Botón de Configuración (¡Ahora dentro del menú lateral! 🍔)
const settingsBtn = document.createElement("button");
settingsBtn.id = "settingsBtn";
settingsBtn.innerHTML = "⚙️ Ajustes del Bot";
settingsBtn.style.cssText = `
  width: 100%; padding: 12px; margin-top: 20px; margin-bottom: 15px;
  background: white; border: 2px solid #ffd6eb; border-radius: 15px;
  font-size: 1em; font-weight: bold; color: #ff477e; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.02); font-family: inherit;
  transition: background 0.2s;
`;

// 🍔 Sección de la Galería dentro del Menú Hamburguesa
const galleryContainer = document.createElement("div");
galleryContainer.id = "galleryContainer";
galleryContainer.style.cssText = "margin-top: auto; padding-top: 15px; border-top: 2px dashed #ffd6eb;";
galleryContainer.innerHTML = `
  <h3 style="color: #ff477e; font-size: 1.1em; margin: 0 0 12px 0; display: flex; align-items: center; gap: 8px; font-family: inherit;">
    🖼️ Galería de Arte
  </h3>
  <div id="galleryGrid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; max-height: 180px; overflow-y: auto; padding-right: 4px;"></div>
`;

// Inyectar el botón y la galería de manera ordenada en la barra lateral
sidebar.appendChild(settingsBtn);
sidebar.appendChild(galleryContainer);

// 🛠️ Crear Panel Modal de Configuración (Ajustes + Recordatorios)
const settingsModal = document.createElement("div");
settingsModal.id = "settingsModal";
settingsModal.style.cssText = `
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
  display: none; align-items: center; justify-content: center; z-index: 10001;
`;
settingsModal.innerHTML = `
  <div style="
    background: white; border-radius: 25px; padding: 25px; width: 90%; max-width: 380px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2); position: relative; font-family: inherit; color: #555;
  ">
    <button id="closeSettingsBtn" style="
      position: absolute; top: 15px; right: 15px; background: #ffd6eb; border: none;
      width: 28px; height: 28px; border-radius: 50%; font-weight: bold; color: #ff477e; cursor: pointer;
    ">✕</button>
    
    <h3 style="color: #ff477e; margin: 0 0 15px 0; font-size: 1.3em; text-align: center;">⚙️ Ajustes de IsaBot</h3>
    
    <label style="font-weight: bold; display: block; margin-bottom: 8px; font-size: 0.95em;">🎭 Personalidad del Bot:</label>
    <select id="personalitySelect" style="
      width: 100%; padding: 10px; border: 2px solid #ffd6eb; border-radius: 12px;
      outline: none; font-family: inherit; color: #555; background: white; margin-bottom: 20px;
    ">
      <option value="kawaii">💕 Modo Kawaii (Tierno y Dulce)</option>
      <option value="tutor">🧠 Modo Tutor Sabio (Explicativo/Tareas)</option>
      <option value="gamer">🎮 Modo Gamer (Divertido/Videojuegos)</option>
    </select>
    
    <label style="font-weight: bold; display: block; margin-bottom: 8px; font-size: 0.95em;">⏰ Configurar Recordatorio Rápido:</label>
    <div style="display: flex; gap: 8px; margin-bottom: 10px;">
      <input id="reminderTask" type="text" placeholder="¿Qué recordar? (Ej: Tomar agua)" style="
        flex: 2; padding: 10px; border: 2px solid #ffd6eb; border-radius: 12px; outline: none; font-size: 0.9em;
      ">
      <input id="reminderTime" type="number" placeholder="Min" min="1" style="
        flex: 1; padding: 10px; border: 2px solid #ffd6eb; border-radius: 12px; outline: none; text-align: center; font-size: 0.9em;
      ">
    </div>
    <button id="setReminderBtn" style="
      width: 100%; padding: 10px; background: linear-gradient(135deg, #ffd6eb, #e3c8ff);
      border: none; border-radius: 12px; font-weight: bold; color: #555; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.05);
    ">Activar Alarma 🔔</button>
    
    <div id="activeReminders" style="margin-top: 15px; max-height: 80px; overflow-y: auto; font-size: 0.85em; color: #888;"></div>
  </div>
`;
document.body.appendChild(settingsModal);

// Vincular selectores con el almacenamiento local
document.getElementById("personalitySelect").value = botPersonality;
document.getElementById("personalitySelect").addEventListener("change", (e) => {
  botPersonality = e.target.value;
  localStorage.setItem("isabot_personality", botPersonality);
});

// Eventos para abrir/cerrar menú de Ajustes
settingsBtn.addEventListener("click", () => settingsModal.style.display = "flex");
document.getElementById("closeSettingsBtn").addEventListener("click", () => settingsModal.style.display = "none");

// ⏰ Lógica de Recordatorios e Hilos de Tiempo
document.getElementById("setReminderBtn").addEventListener("click", () => {
  const task = document.getElementById("reminderTask").value.trim();
  const minutes = parseInt(document.getElementById("reminderTime").value);
  
  if (!task || isNaN(minutes) || minutes <= 0) return;
  
  const activeReminders = document.getElementById("activeReminders");
  const reminderItem = document.createElement("div");
  reminderItem.style.cssText = "background: #fff5f8; padding: 6px 10px; border-radius: 8px; margin-top: 5px; display: flex; justify-content: space-between;";
  reminderItem.innerHTML = `<span>⏳ ${task} (en ${minutes} min)</span>`;
  activeReminders.appendChild(reminderItem);
  
  document.getElementById("reminderTask").value = "";
  document.getElementById("reminderTime").value = "";
  
  setTimeout(() => {
    alert(`🔔 ¡IsaBot te recuerda!: ${task} 💕`);
    reminderItem.remove();
  }, minutes * 60 * 1000);
});

// 🔍 Crear dinámicamente el Modal para Ampliar y Descargar Imágenes
const previewModal = document.createElement("div");
previewModal.id = "previewModal";
previewModal.style.cssText = `
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.7); backdrop-filter: blur(5px);
  display: none; align-items: center; justify-content: center; z-index: 10000;
`;
previewModal.innerHTML = `
  <div style="background: white; border-radius: 25px; padding: 20px; max-width: 450px; width: 90%; text-align: center; position: relative;">
    <button id="closePreviewBtn" style="position: absolute; top: 15px; right: 15px; background: #ffd6eb; border: none; width: 30px; height: 30px; border-radius: 50%; font-weight: bold; color: #ff477e; cursor: pointer;">✕</button>
    <h3 style="color: #ff477e; margin: 5px 0 15px 0;">✨ Previsualización ✨</h3>
    <img id="modalImage" src="" style="width: 100%; max-height: 400px; object-fit: contain; border-radius: 15px;">
    <a id="downloadImageBtn" download="isabot_art.jpg" href="#" style="display: inline-block; margin-top: 15px; width: 100%; padding: 12px; background: linear-gradient(135deg, #ffd6eb, #e3c8ff); border-radius: 15px; color: #555; text-decoration: none; font-weight: bold; box-sizing: border-box;">📥 Descargar Imagen</a>
  </div>
`;
document.body.appendChild(previewModal);

previewModal.querySelector("#closePreviewBtn").addEventListener("click", () => previewModal.style.display = "none");

function openImageModal(imgSrc) {
  document.getElementById("modalImage").src = imgSrc;
  document.getElementById("downloadImageBtn").href = imgSrc;
  previewModal.style.display = "flex";
}

let currentUser = null;
let currentChatId = null;

const CLOUDFLARE_URL = "https://glad-entrepreneur-cancer-cdna.trycloudflare.com/chat";
const ISABOT_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://localhost:5001/chat" : CLOUDFLARE_URL;

const emojis = ["🌸","🌈","⭐","🔥","🍀","🐱","🐶","🎵","💎","⚡","🦋","🌻"];
function getRandomEmoji() { return emojis[Math.floor(Math.random() * emojis.length)]; }

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
  modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,182,193,0.6); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 9999;";
  modal.innerHTML = `
    <div style="background: white; border-radius: 30px; padding: 40px 35px; text-align: center; max-width: 360px; width: 90%;">
      <div style="font-size: 3em; margin-bottom: 10px;">💕</div>
      <h2 style="color: #ff477e; margin: 0 0 8px 0;">¡Hola!</h2>
      <p style="color: #888; margin: 0 0 25px 0;">Soy IsaBot~ ¿Cómo te llamas? uwu 🌸</p>
      <input id="nameInput" type="text" placeholder="Tu nombre aquí..." style="width: 100%; padding: 14px 18px; border: 2px solid #ffd6eb; border-radius: 20px; outline: none; margin-bottom: 15px;">
      <button id="loginConfirmBtn" style="width: 100%; padding: 14px; background: linear-gradient(135deg, #ffd6eb, #e3c8ff); border: none; border-radius: 20px; font-weight: bold; color: #555; cursor: pointer;">¡Empezar a chatear! ✨</button>
    </div>
  `;
  document.body.appendChild(modal);
  const nameInput = modal.querySelector("#nameInput");
  nameInput.focus();

  function confirmarLogin() {
    const nombre = nameInput.value.trim();
    if (!nombre) return;
    currentUser = `${getRandomEmoji()} ${nombre}`;
    localStorage.setItem("isabot_user", currentUser);
    userFooter.textContent = "👤 " + currentUser;
    modal.remove(); loadChats(); autoOpenOrCreateChat(); updateGallery();
  }
  modal.querySelector("#loginConfirmBtn").addEventListener("click", confirmarLogin);
  nameInput.addEventListener("keypress", (e) => { if (e.key === "Enter") confirmarLogin(); });
}

function autoOpenOrCreateChat() {
  let chats = JSON.parse(localStorage.getItem("chats")) || [];
  const userChats = chats.filter(c => c.owner === currentUser);
  if (userChats.length > 0) { openChat(userChats[userChats.length - 1].id); }
  else {
    const chatId = "chat_" + Date.now();
    saveChat({ id: chatId, owner: currentUser, messages: [], pinned: false, createdAt: new Date() });
    loadChats(); openChat(chatId);
    setTimeout(() => { appendBotMessage(`¡Kyaa~ hola! 💕 Soy IsaBot, tu asistente ajustable ✨ ¿En qué puedo ayudarte hoy? 🌸`); }, 300);
  }
}

function updateGallery() {
  const galleryGrid = document.getElementById("galleryGrid");
  if (!galleryGrid) return; galleryGrid.innerHTML = "";
  let chats = JSON.parse(localStorage.getItem("chats")) || [];
  chats.filter(c => c.owner === currentUser).forEach(chat => {
    chat.messages.forEach(msg => {
      if (msg.type === "imagen") {
        const imgThumb = document.createElement("img");
        imgThumb.src = msg.text;
        imgThumb.style.cssText = "width: 100%; height: 60px; object-fit: cover; border-radius: 8px; border: 1px solid #ffd6eb; cursor: pointer;";
        imgThumb.addEventListener("click", () => openImageModal(msg.text));
        galleryGrid.appendChild(imgThumb);
      }
    });
  });
}

menuBtn.addEventListener("click", () => sidebar.classList.toggle("open"));
newChatBtn.addEventListener("click", () => {
  if (!currentUser) return;
  const chatId = "chat_" + Date.now();
  saveChat({ id: chatId, owner: currentUser, messages: [], pinned: false, createdAt: new Date() });
  loadChats(); openChat(chatId); sidebar.classList.remove("open");
});

function saveChat(chat) {
  let chats = JSON.parse(localStorage.getItem("chats")) || [];
  chats.push(chat); localStorage.setItem("chats", JSON.stringify(chats));
}

function loadChats() {
  chatList.innerHTML = "";
  let chats = JSON.parse(localStorage.getItem("chats")) || [];
  chats.filter(c => c.owner === currentUser).forEach(chat => {
    const li = document.createElement("li");
    li.textContent = "Chat " + new Date(chat.createdAt).toLocaleTimeString();
    if (chat.pinned) li.classList.add("pinned");
    li.addEventListener("click", () => { openChat(chat.id); sidebar.classList.remove("open"); });
    chatList.appendChild(li);
  });
}

function updateChat(chat) {
  let chats = JSON.parse(localStorage.getItem("chats")) || [];
  chats = chats.map(c => c.id === chat.id ? chat : c);
  localStorage.setItem("chats", JSON.stringify(chats));
}

// 📋 FUNCIÓN DE COPIAR CÓDIGO INTELIGENTE AL ESTILO CHATGPT
function formatAndCopyCode(text, bubbleElement) {
  const codeRegex = /```([\s\S]*?)```/g;
  if (codeRegex.test(text)) {
    bubbleElement.innerHTML = text.replace(codeRegex, (match, codeContent) => {
      const codeId = "code_" + Math.floor(Math.random() * 100000);
      return `
        <div style="position: relative; background: #282c34; color: #abb2bf; padding: 12px; border-radius: 10px; margin: 8px 0; font-family: monospace; text-align: left; font-size: 0.9em; overflow-x: auto;">
          <button onclick="navigator.clipboard.writeText(document.getElementById('${codeId}').innerText); this.textContent='📋 ¡Copiado!'; setTimeout(()=>this.textContent='📋 Copiar', 2000);" style="position: absolute; top: 5px; right: 5px; background: rgba(255,255,255,0.1); border: none; color: #fff; padding: 4px 8px; font-size: 0.8em; border-radius: 4px; cursor: pointer;">📋 Copiar</button>
          <pre id="${codeId}" style="margin:0;">${codeContent.trim()}</pre>
        </div>
      `;
    });
  } else {
    bubbleElement.textContent = text;
  }
}

// ── BURBUJAS DEL BOT CON ENGRANAJES E HISTORIAL
function appendBotMessage(content, isImage = false) {
  const container = document.createElement("div");
  container.style.cssText = "display: flex; align-items: flex-end; gap: 10px; margin-bottom: 14px; width: 100%;";

  const avatarContainer = document.createElement("div");
  avatarContainer.style.cssText = "display: flex; align-items: center; justify-content: center; flex-shrink: 0;";
  avatarContainer.innerHTML = KAWAII_ROBOT_SVG;

  const bubble = document.createElement("div");
  bubble.className = "bot";
  bubble.style.margin = "0"; 

  if (isImage) {
    const img = document.createElement("img");
    img.src = content;
    img.style.cssText = "width: 100%; max-width: 280px; border-radius: 15px; margin-top: 5px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); cursor: pointer;";
    img.addEventListener("click", () => openImageModal(content));
    bubble.textContent = "¡Mira lo que pinté para ti! 🎨✨\n"; bubble.appendChild(img);
  } else {
    formatAndCopyCode(content, bubble);
  }

  container.appendChild(avatarContainer); container.appendChild(bubble);
  messages.appendChild(container); messages.scrollTop = messages.scrollHeight;
  return container;
}

function openChat(chatId) {
  currentChatId = chatId; messages.innerHTML = "";
  let chats = JSON.parse(localStorage.getItem("chats")) || [];
  const chat = chats.find(c => c.id === chatId);
  if (chat) {
    chat.messages.forEach(msg => {
      if (msg.sender === "user") {
        const uBubble = document.createElement("div"); uBubble.className = "user"; uBubble.textContent = msg.text; messages.appendChild(uBubble);
      } else {
        appendBotMessage(msg.text, msg.type === "imagen");
      }
    });
  }
  messages.scrollTop = messages.scrollHeight;
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => { if (e.key === "Enter") { e.preventDefault(); sendMessage(); } });

async function sendMessage() {
  const text = userInput.value.trim();
  if (!currentChatId || text === "") return;

  const userBubble = document.createElement("div"); userBubble.className = "user"; userBubble.textContent = text; messages.appendChild(userBubble);

  let chats = JSON.parse(localStorage.getItem("chats")) || [];
  const chat = chats.find(c => c.id === currentChatId);
  chat.messages.push({ sender: "user", text }); updateChat(chat);
  userInput.value = ""; messages.scrollTop = messages.scrollHeight;

  const thinkingContainer = appendBotMessage("IsaBot está procesando... 🌸✨");

  try {
    const response = await fetch(ISABOT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mensaje: text,
        personalidad: botPersonality,
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
      updateChat(chat); updateGallery(); 
    } else {
      const botText = data.respuesta || data.response || data.text || "No obtuve respuesta 💕";
      appendBotMessage(botText, false);
      chat.messages.push({ sender: "bot", text: botText }); updateChat(chat);
    }

  } catch (error) {
    if (messages.contains(thinkingContainer)) messages.removeChild(thinkingContainer);
    const errBubble = document.createElement("div"); errBubble.className = "bot error";
    errBubble.textContent = "Kyaa~ error de conexión 💔 ¿Encendiste el server.py?"; messages.appendChild(errBubble);
  }
  messages.scrollTop = messages.scrollHeight;
}
