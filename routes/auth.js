const { User } = require("../models/user");
//const config = require("config");
var jwt = require("jsonwebtoken");
//const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const Joi = require("joi");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("invalid email or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("invalid email or password");
  const token = user.generateAuthToken();
  res.send(token);
});
function validate(user) {
  const schema = Joi.object({
    email: Joi.string().required().min(5).max(50).email(),
    password: Joi.string().required().min(5).max(255),
  });
  return schema.validate(user);
}

module.exports = router;
