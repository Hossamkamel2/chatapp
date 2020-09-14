//const config = require("config");
const express = require("express");
var cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const app = express();
const _ = require("lodash");
const { User } = require("./models/user");
const { Message } = require("./models/messages");
const server = require("http").Server(app);
const io = require("socket.io")(server);

io.on("connection", (socket) => {
  socket.on("message", async (data) => {
    const { sender, message } = data;
    const user = await User.findById(sender).select({ name: 1 });
    const mess = new Message(data, _.pick(["sender._id", "message"]));
    try {
      await mess.save();
      const notificate = { _id: mess._id, sender: user, message: message };

      io.emit("newMessage", notificate);
    } catch {}
  });
});

// const http = require("http");
// const socketIo = require("socket.io");
const users = require("./routes/users");
const auth = require("./routes/auth");
const mess = require("./routes/messages");
// if (!config.get("jwtPrivateKey")) {
//   console.error("fetal error jwt is not defined");
//   process.exit(1);
// }

mongoose
  .connect("mongodb://localhost/chatapp")
  .then(() => console.log("connected to mongo DB..."))
  .catch(() => console.log("COULDNOT connect to mongo DB..."));

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(express.json());

app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/mess", mess);

const port = process.env.PORT || 3000;

server.listen(port, () => console.log(`Listening on port ${port}....`));
