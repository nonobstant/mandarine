const Express = require ("express")();
const Http = require("http").Server(Express);
const Socketio = require("socket.io")(Http, {
  cors: {
    origin: "https://prismflower.xyz", //http://localhost:2368
    methods: ["GET", "POST"],
    allowedHeaders: ["content-type"],
    credentials: true
  },
});
//init database
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)
//init db.users
db.defaults({ users:[] }).write()

//html sanitizer
const sanitizeHtml = require('sanitize-html');

// Ghost admin
const GhostAdminAPI = require('@tryghost/admin-api');

// Configure the client
const api = new GhostAdminAPI({
    url: 'https://prismflower.xyz', //http://localhost:2368
    // Admin API key goes here
    key: process.env.SECRET_KEY, //'6022b6c5f75a5e4148bfe8a8:abae3db74fd674aaac2c30dbdf9b76fbdedd74c058f3e3a8cc83bfa114e26b54'
    version: 'v3'
});

//vars
var welcomeMessage = "Connected !";
var chat = [];
var room = [];

var post_sample = {
  title : "",
  html: "",
  feature_image: "",
  featured: false,
  status: "published",
  visibility: "public",
  authors:[],
  tags: [],
};

function prismLevel(user, x) {
  db.get('users').find({ id: user }).update('prism', n => n + x).write()
  let xPrismvalue = x / 0.77;
  db.get('users').find({ id: user }).update('xPrism', n => n + xPrismvalue).write()
  let userDb = db.get('users').find({ id: user }).value()
  if (userDb.xPrism > 100) {
    db.get('users').find({ id: user }).update('xPrism', n => n - 100).write()
    db.get('users').find({ id: user }).update('flower', n => n + 1).write()
  }

}

Socketio.on("connection", socket => {
  socket.emit("log", welcomeMessage);

  // **HOMEPAGE**
  socket.on("getprism", data => {

    let dbUser = db.get('users').find({ id: data }).value()
    if (dbUser == null) {
      // console.log(data +" is not a creator");
    } else {
      let prismPack = { prism : dbUser.prism, xPrism : dbUser.xPrism }
      socket.emit("setprism", prismPack)
    }
  });

  // **ACCOUNT**
  socket.on("syncaccount", data => {

    let dbUser = db.get('users').find({ id: data }).value()
    if (dbUser == null) {
      let isCreator = false;
      socket.emit("checkcreator", isCreator);
    } else {
      socket.emit("userinfo", dbUser)
    }
  });
  socket.on("becreator", data => {
    let dbUser = db.get('users').find({ id: data }).value()
    if (dbUser == null) {
      db.get('users').push({id: data, prism: 0, xPrism: 0, flower: 0, rank: 'creator'}).write()
    } else {
      console.log("user already exist")
    }

  });


  // **CHAT**
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
    let clean_data =  sanitizeHtml(data);
    console.log(clean_data);
    chat.push(clean_data);
    if (chat.length > 10) {
      chat = [clean_data];
    };
    chat = [...new Set(chat)];
    Socketio.emit("getchat", chat);
  });

  //Interfer with create Page
  socket.on('disconnect', () => {
      room = [];
      Socketio.emit("log", welcomeMessage);
      Socketio.emit("getroom", room);
  });

  // **CREATE**
  socket.on("verifusr", data => {
    let unique_access_token = false;
    let dbUser = db.get('users').find({ id: data.usrname }).value()
    if (dbUser == null) {
      console.log(dbUser)
      unique_access_token = false
    } else {
      unique_access_token = true
    }

    // console.log(data.usrname + " | Access : "+unique_access_token);
    //send token
    socket.emit("gettoken", unique_access_token);

    socket.on("postcreation", data => {
      let post = post_sample;
      post.title = data.title;
      post.html = data.html;
      post.feature_image = data.img_url;
      post.authors.push(data.author);
      post.tags.push("Gallery");
      console.log(post)
      prismLevel(data.author.name, 7)

      // authenticated request
      api.posts.add(post)
          .then(response => {
            // console.log(response);
            chat.push('<span class="admin-text">' + data.author.name + ' as created a new post !</span>');
            Socketio.emit("getchat", chat);
          })
          .catch(error => console.error(error));

    });
  });
});

Http.listen(process.env.PORT || 3000, ()=> {
  console.log("Listening...");
})
