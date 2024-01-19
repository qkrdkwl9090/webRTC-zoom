const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const cameraSelect = document.getElementById("cameras");

let myStream;
let muted = false;
let cameraOff = false;

const getCameras = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === "videoinput");
    const currentCamera = myStream.getVideoTracks()[0];
    cameras.forEach((camera) => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.innerText = camera.label;
      if (currentCamera.label === camera.label) option.selected = true;
      cameraSelect.appendChild(option);
    });
  } catch (e) {
    console.error(e);
  }
};
const getMedia = async (deviceId) => {
  const initialConstrains = {
    audio: true,
    video: { facingMode: "user" },
  };
  const cameraConstrains = {
    audio: true,
    video: { deviceId: { exact: deviceId } },
  };

  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? cameraConstrains : initialConstrains
    );
    myFace.srcObject = myStream;
    if (!deviceId) await getCameras();
  } catch (e) {
    console.error(e);
  }
};
getMedia();

const handleMuteClick = () => {
  myStream
    .getAudioTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (!muted) {
    muteBtn.innerText = "Unmute";
    muted = true;
  } else {
    muteBtn.innerText = "Mute";
    muted = false;
  }
};
const handleCameraClick = () => {
  myStream
    .getVideoTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (!cameraOff) {
    cameraBtn.innerText = "Turn Camera On";
    cameraOff = true;
  } else {
    cameraBtn.innerText = "Turn Camera Off";
    cameraOff = false;
  }
};

const handleCameraChange = async () => await getMedia(cameraSelect.value);

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
cameraSelect.addEventListener("input", handleCameraChange);

// const welcome = document.querySelector("#welcome");
// const form = welcome.querySelector("form");
// const room = document.querySelector("#room");

// room.hidden = true;

// let roomName = "";

// const handleMessageSubmit = (event) => {
//   event.preventDefault();
//   const input = room.querySelector("#msg input");
//   const value = input.value;
//   socket.emit("new_message", input.value, roomName, () => {
//     addMessage(`You: ${value}`);
//   });
//   input.value = "";
// };
// const handleNicknameSubmit = (event) => {
//   event.preventDefault();
//   const input = room.querySelector("#name input");
//   const value = input.value;
//   socket.emit("nickname", input.value, () => {
//     alert("Nickname Saved");
//   });
// };
// const showRoom = () => {
//   welcome.hidden = true;
//   room.hidden = false;
//   const h3 = room.querySelector("h3");
//   h3.innerText = `Room ${roomName}`;
//   const msgForm = room.querySelector("#msg");
//   const nameForm = room.querySelector("#name");
//   msgForm.addEventListener("submit", handleMessageSubmit);
//   nameForm.addEventListener("submit", handleNicknameSubmit);
// };

// const addMessage = (message) => {
//   const ul = room.querySelector("ul");
//   const li = document.createElement("li");
//   li.innerHTML = message;
//   ul.appendChild(li);
// };

// const handleRoomSubmit = (event) => {
//   event.preventDefault();
//   const input = form.querySelector("input");
//   socket.emit("enter_room", input.value, showRoom);
//   roomName = input.value;
//   input.value = "";
// };

// form.addEventListener("submit", handleRoomSubmit);

// const setCount = (count) => {
//   const h3 = room.querySelector("h3");
//   h3.innerText = `Room ${roomName} (${count})`;
// };

// socket.on("welcome", (name, newCount) => {
//   setCount(newCount);
//   addMessage(`${name ?? "unknown"} arrived!!!`);
// });
// socket.on("bye", (name, newCount) => {
//   setCount(newCount);
//   addMessage(`${name} left!!!`);
// });
// socket.on("new_message", (message) => addMessage(message));
// socket.on("room_change", (rooms) => {
//   const roomList = welcome.querySelector("ul");
//   if (rooms.length === 0) {
//     roomList.innerHTML = "";
//     return;
//   }
//   rooms.forEach((room) => {
//     const li = document.createElement("li");
//     li.innerText = room;
//     roomList.appendChild(li);
//   });
// });
