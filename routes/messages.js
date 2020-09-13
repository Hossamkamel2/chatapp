const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const Joi = require("joi");
const _ = require("lodash");
const app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

const message = require("../models/messages");

router.get("/", auth, async (req, res) => {
  const messagewithuser = await message
    .find()
    .populate("User -_id sender", "-_id -email -password -__v")
    .select(" message");
  res.send(messagewithuser);
});
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  let mess = new message(req.body, _.pick(["_id", "message"]));
  io.emit("message", mess);
  await mess.save();
  res.sendStatus(200);
});
function validate(message) {
  const schema = Joi.object({
    sender: Joi.string().required(),
    message: Joi.string().required(),
  });
  return schema.validate(message);
}

module.exports = router;
