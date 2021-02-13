const Express = require ("express")();
const Http = require("http").Server(Express);
const Socketio = require("socket.io")(Http, {
  cors: {
    origin: "http://localhost:2368",
    methods: ["GET", "POST"],
    allowedHeaders: ["content-type"],
    credentials: true
  },
});


var welcomeMessage = "Connected !";
var chat = [];
var room = [];

Socketio.on("connection", socket => {
  socket.emit("log", welcomeMessage);

  socket.on("getusr", data => {
    // console.log(data)
    room.push(data)
    if (room.length > 5) {
      room = [data];
    }
    room = [...new Set(room)]
    Socketio.emit("getroom", room)
  });

  socket.on("getmsg", data => {
    console.log(data)
    chat.push(data)
    if (chat.length > 10) {
      chat = [data];
    }
    chat = [...new Set(chat)]
    Socketio.emit("getchat", chat)
  });
});

Http.listen(process.env.PORT || 3000, ()=> {
  console.log("Listening...");
})