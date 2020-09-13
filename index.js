//const config = require("config");
const express = require("express");
var cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const app = express();
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

app.listen(port, () => console.log(`Listening on port ${port}....`));
