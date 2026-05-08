// Configuración Firebase (copiar la tuya desde Firebase Console)
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROJECT.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_PROJECT.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Elementos
const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const messages = document.getElementById("messages");
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const chatList = document.getElementById("chatList");
const newChatBtn = document.getElementById("newChatBtn");
const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const email = document.getElementById("email");
const password = document.getElementById("password");
const username = document.getElementById("username");
const userFooter = document.getElementById("userFooter");

let currentChatId = null;

// ----------------------
// 🔐 Registro/Login
// ----------------------
registerBtn.addEventListener("click", () => {
  auth.createUserWithEmailAndPassword(email.value, password.value)
    .then(userCredential => {
      const user = userCredential.user;
      db.collection("users").doc(user.uid).set({ name: username.value });
      alert("Usuario registrado 💕");
    })
    .catch(error => alert(error.message));
});

loginBtn.addEventListener("click", () => {
  auth.signInWithEmailAndPassword(email.value, password.value)
    .then(userCredential => {
      const user = userCredential.user;
      db.collection("users").doc(user.uid).get().then(doc => {
        if (doc.exists) {
          userFooter.textContent = "👤 " + doc.data().name + " 💕";
        }
      });
      loadChats();
      alert("Bienvenido 🌸");
    })
    .catch(error => alert(error.message));
});

// ----------------------
// 💬 Chats privados
// ----------------------
newChatBtn.addEventListener("click", () => {
  const user = auth.currentUser;
  if (!user) return alert("Debes iniciar sesión 💕");

  db.collection("chats").add({
    userId: user.uid,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    messages: []
  }).then(() => {
    alert("Chat creado 🌸✨");
    loadChats();
  });
});

function loadChats() {
  const user = auth.currentUser;
  if (!user) return;

  db.collection("chats").where("userId", "==", user.uid).get()
    .then(snapshot => {
      chatList.innerHTML = "";
      snapshot.forEach(doc => {
        const li = document.createElement("li");
        li.textContent = "Chat " + doc.id;
        li.addEventListener("click", () => openChat(doc.id));
        chatList.appendChild(li);

        // Botón eliminar
        const delBtn = document.createElement("button");
        delBtn.textContent = "🗑️";
        delBtn.style.marginLeft = "10px";
        delBtn.addEventListener("click", () => deleteChat(doc.id));
        li.appendChild(delBtn);
      });
    });
}

function openChat(chatId) {
  currentChatId = chatId;
  messages.innerHTML = "";
  db.collection("chats").doc(chatId).get().then(doc => {
    const data = doc.data();
    data.messages.forEach(msg => {
      const bubble = document.createElement("div");
      bubble.className = msg.sender;
      bubble.textContent = msg.text;
      messages.appendChild(bubble);
    });
  });
}

function deleteChat(chatId) {
  db.collection("chats").doc(chatId).delete().then(() => {
    alert("Chat eliminado 🗑️");
    loadChats();
  });
}

// ----------------------
// 📩 Mensajes
// ----------------------
function sendMessage() {
  const text = userInput.value.trim();
  if (text !== "" && currentChatId) {
    const userBubble = document.createElement("div");
    userBubble.className = "user";
    userBubble.textContent = text;
    messages.appendChild(userBubble);

    // Guardar mensaje en Firestore
    db.collection("chats").doc(currentChatId).update({
      messages: firebase.firestore.FieldValue.arrayUnion({ sender: "user", text })
    });

    setTimeout(() => {
      const botText = "IsaBot 💕 dice: " + text + " 🌸✨";
      const botBubble = document.createElement("div");
      botBubble.className = "bot";
      botBubble.textContent = botText;
      messages.appendChild(botBubble);

      db.collection("chats").doc(currentChatId).update({
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
  loadChats();
});
