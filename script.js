const API_URL = "https://isa-bot-nine.vercel.app/api/chat";

async function sendMessage(message) {
  const response = await fetch(`${API_URL}?message=${encodeURIComponent(message)}`);
  const data = await response.json();
  return data.reply;
}

document.getElementById("sendBtn").addEventListener("click", async () => {
  const input = document.getElementById("userInput").value;
  const reply = await sendMessage(input);
  alert("Bot: " + reply);
});
