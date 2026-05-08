// Importar Firebase v12 (modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, getDoc, getDocs, query, where, updateDoc, deleteDoc, orderBy } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBNTRiC07IkOAegZnedJz7o0lUlxa-wVBo",
  authDomain: "isabot-a234a.firebaseapp.com",
  projectId: "isabot-a234a",
  storageBucket: "isabot-a234a.firebasestorage.app",
  messagingSenderId: "559355649312",
  appId: "1:559355649312:web:e509ae34c769479ca58b45",
  measurementId: "G-SF1LDNL6BF"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Elementos del DOM
const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const email = document.getElementById("email");
const password = document.getElementById("password");
const username = document.getElementById("username");
const userFooter = document.getElementById("userFooter");
const newChatBtn = document.getElementById("newChatBtn");
const chatList = document.getElementById("chatList");
const messages = document.getElementById("messages");
const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");

let currentChatId = null;

// ----------------------
// 🔐 Registro/Login
// ----------------------
registerBtn.addEventListener("click", async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;
    await addDoc(collection(db, "users"), { uid: user.uid, name: username.value });
    alert("Usuario registrado 💕");
  } catch (error) {
    alert(error.message);
  }
});

loginBtn.addEventListener("click", async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;
    userFooter.textContent = "👤 " + username.value + " 💕";
    loadChats(user.uid);
    alert("Bienvenido 🌸");
  } catch (error) {
    alert(error.message);
  }
});

// ----------------------
// 💬 Chats privados
// ----------------------
newChatBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return alert("Debes iniciar sesión 💕");

  await addDoc(collection(db, "chats"), {
    userId: user.uid,
    createdAt: new Date(),
    messages: [],
    pinned: false
  });
  alert("Chat creado 🌸✨");
  loadChats(user.uid);
});

async function loadChats(uid) {
  chatList.innerHTML = "";
  const q = query(collection(db, "chats"), where("userId", "==", uid), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const li = document.createElement("li");
    li.textContent = "Chat " + docSnap.id + " (" + new Date(data.createdAt.seconds * 1000).toLocaleString() + ")";
    if (data.pinned) li.classList.add("pinned");

    // Acciones
    const actions = document.createElement("div");
    actions.className = "chat-actions";

    const pinBtn = document.createElement("button");
    pinBtn.textContent = "📌";
    pinBtn.addEventListener("click", async () => {
      await updateDoc(doc(db, "chats", docSnap.id), { pinned: !data.pinned });
      loadChats(uid);
    });

    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️";
    delBtn.addEventListener("click", async () => {
      await deleteDoc(doc(db, "chats", docSnap.id));
      loadChats(uid);
    });

    actions.appendChild(pinBtn);
    actions.appendChild(delBtn);
    li.appendChild(actions);

    li.addEventListener("click", () => openChat(docSnap.id));
    chatList.appendChild(li);
  });
}

async function openChat(chatId) {
  currentChatId = chatId;
  const docSnap = await getDoc(doc(db, "chats", chatId));
  const data = docSnap.data();
  messages.innerHTML = "";
  data.messages.forEach(msg => {
    const bubble = document.createElement("div");
    bubble.className = msg.sender;
    bubble.textContent = msg.text;
    messages.appendChild(bubble);
  });
}

// ----------------------
// 📩 Mensajes
// ----------------------
async function sendMessage() {
  const text = userInput.value.trim();
  if (text !== "" && currentChatId) {
    const userBubble = document.createElement("div");
    userBubble.className = "user";
    userBubble.textContent = text;
    messages.appendChild(userBubble);

    await updateDoc(doc(db, "chats", currentChatId), {
      messages: firebase.firestore.FieldValue.arrayUnion({ sender: "user", text })
    });

    setTimeout(async () => {
      const botText = "IsaBot 💕 dice: " + text + " 🌸✨";
      const botBubble = document.createElement("div");
      botBubble.className = "bot";
      botBubble.textContent = botText;
      messages.appendChild(botBubble);

      await updateDoc(doc(db, "chats", currentChatId), {
        messages: firebase.firestore.FieldValue.arrayUnion({ sender: "bot", text: botText })
      });

      messages.scrollTop = messages.scrollHeight;
    }, 600);

    userInput.value = "";
    messages.scrollTop = messages.scrollHeight;
  }
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
});

// ----------------------
// 📂 Menú lateral toggle
// ----------------------
menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  const user = auth.currentUser;
  if (user) loadChats(user.uid);
});
