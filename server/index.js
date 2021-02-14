const Express = require ("express")();
const Http = require("http").Server(Express);
const Socketio = require("socket.io")(Http, {
  cors: {
    origin: "https://prismflower.xyz",
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
    Socketio.emit("getchat", chat)
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

  socket.on('disconnect', () => {
      room = [];
      Socketio.emit("log", welcomeMessage);
      Socketio.emit("getroom", room);
  });

  // socket.on("delusr", data => {
  //   console.log(data + " as disconnected")
  //   var i = room.indexOf(data);
  //   room.splice(i, 1);
  //   room = [...new Set(room)]
  //   Socketio.emit("getroom", room)
  // });
});

Http.listen(process.env.PORT || 3000, ()=> {
  console.log("Listening...");
})
