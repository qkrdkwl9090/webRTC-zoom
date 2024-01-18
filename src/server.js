import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log("Hello World!");

// http server
const server = http.createServer(app);
// socket.io server
const io = SocketIO(server);

io.on("connection", (socket) => {
  console.log(socket);
});

// webSocket server
// const sockets = [];
// wss.on("connection", (socket) => {
//   sockets.push(socket);
//   console.log("Connected to Browser ✅");
//   socket.on("message", (message) => {
//     const msg = JSON.parse(message);
//     switch (msg.type) {
//       case "new_message":
//         sockets.forEach((aSocket) =>
//           aSocket.send(`${socket?.nickname || "unknown"}: ${msg.payload}`)
//         );
//         break;
//       case "nickname":
//         socket["nickname"] = msg.payload;
//         break;
//     }
//   });
//   socket.on("close", () => console.log("Disconnected from the Browser ❌"));
// });

server.listen(3000, handleListen);
