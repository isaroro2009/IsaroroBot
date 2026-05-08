function loadChats() {
  const user = auth.currentUser;
  if (!user) return;

  db.collection("chats").where("userId", "==", user.uid)
    .orderBy("createdAt", "desc")
    .get()
    .then(snapshot => {
      chatList.innerHTML = "";
      snapshot.forEach(doc => {
        const data = doc.data();
        const li = document.createElement("li");

        // Nombre + fecha
        const info = document.createElement("div");
        info.innerHTML = `<strong>Chat ${doc.id}</strong><br><span>${data.createdAt?.toDate().toLocaleString()}</span>`;
        li.appendChild(info);

        // Acciones (pin y eliminar)
        const actions = document.createElement("div");
        actions.className = "chat-actions";

        const pinBtn = document.createElement("button");
        pinBtn.textContent = "📌";
        pinBtn.addEventListener("click", () => pinChat(doc.id));

        const delBtn = document.createElement("button");
        delBtn.textContent = "🗑️";
        delBtn.addEventListener("click", () => deleteChat(doc.id));

        actions.appendChild(pinBtn);
        actions.appendChild(delBtn);
        li.appendChild(actions);

        // Abrir chat al hacer clic
        li.addEventListener("click", () => openChat(doc.id));

        chatList.appendChild(li);
      });
    });
}

// Fijar chat (marcarlo como importante)
function pinChat(chatId) {
  db.collection("chats").doc(chatId).update({
    pinned: true
  }).then(() => {
    alert("Chat fijado 📌");
    loadChats();
  });
}
