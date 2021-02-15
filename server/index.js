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
const sanitizeHtml = require('sanitize-html');
const GhostAdminAPI = require('@tryghost/admin-api');

// Configure the client
const api = new GhostAdminAPI({
    url: 'https://prismflower.xyz', //http://localhost:2368
    // Admin API key goes here
    key: process.env.SECRET_KEY,
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
var access_token = false;
var access_list = [
  "nonobstant",
  "sorenanoni",
  "Chintoxique",
  "Wagsamoht",
  "Yuuui",
]

Socketio.on("connection", socket => {
  socket.emit("log", welcomeMessage);

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
    console.log(data.usrname + " | Creation mode !");
    access_list.forEach(id => {
      if (data.usrname == id) {
        access_token = true
      };
    });

    console.log(data.usrname + " | Access : "+access_token);
    //send token
    socket.emit("gettoken", access_token);

    socket.on("postcreation", data => {
      let post = post_sample;
      post.title = data.title;
      post.html = data.html;
      post.feature_image = data.img_url;
      post.authors.push(data.author);
      post.tags.push({name: "Gallery"});

      // authenticated request
      api.posts.add(post)
          .then(response => {
            console.log("success");
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
