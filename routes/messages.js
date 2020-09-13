const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const Joi = require("joi");
const _ = require("lodash");
const app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
const { Message } = require("../models/messages");

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

router.put("/:id", auth, async (req, res) => {
  const { error } = validateedit(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const mess = await Message.findById(req.params.id);
  console.log(mess);
  if (!mess) return res.status(400).send("Invalid message.");
  if (!canChange(req.user._id, mess.sender._id))
    return res.status(403).send("Access denied.");
  mess.message = req.body.message;
  await mess.save();
  res.send(mess);
});

router.delete("/:id", auth, async (req, res) => {
  const { error } = validateedit(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const mess = await Message.findById(req.params.id);
  console.log(mess);
  if (!mess) return res.status(400).send("Invalid message.");
  if (!canChange(req.user._id, mess.sender._id))
    return res.status(403).send("Access denied.");
  await mess.remove();

  res.send(mess);
});

function validate(message) {
  const schema = Joi.object({
    sender: Joi.string().required(),
    message: Joi.string().required(),
  });

  return schema.validate(message);
}

function validateedit(message) {
  const schema = Joi.object({
    message: Joi.string().required(),
  });

  return schema.validate(message);
}

function canChange(userid, senderid) {
  return userid === senderid;
}

module.exports = router;
