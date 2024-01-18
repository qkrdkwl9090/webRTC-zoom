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
  socket.onAny((event) => {
    console.log("Socket Event: " + event);
  });
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome", socket.nickname);
  });
  socket.on("new_message", (message, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${message}`);
    done();
  });
  socket.on("nickname", (nickname, done) => {
    socket["nickname"] = nickname;
    done();
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname)
    );
  });
});

server.listen(3000, handleListen);
