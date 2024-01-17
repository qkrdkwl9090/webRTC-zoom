const messageList = document.querySelector("ul");
const messageForm = document.querySelector("#message");
const nickForm = document.querySelector("#nick");

const socket = new WebSocket(`ws://${window.location.host}`);
socket.addEventListener("open", () => {
  console.log("Connected to Server ✅");
});
socket.addEventListener("message", (message) => {
  const li = document.createElement("li");
  li.innerText = message.data;
  messageList.append(li);
});
socket.addEventListener("close", () => {
  console.log("Disconnected from Server ❌");
});

function makeMessage({ type, payload }) {
  const msg = { type, payload };
  return JSON.stringify(msg);
}

messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(
    makeMessage({
      type: "nickname",
      payload: input.value,
    })
  );
  const li = document.createElement("li");
  li.innerText = `You: ${input.value}`;
  messageList.append(li);
  input.value = "";
});

nickForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = nickForm.querySelector("input");
  socket.send(
    makeMessage({
      type: "new_message",
      payload: input.value,
    })
  );
});
