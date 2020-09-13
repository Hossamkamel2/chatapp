const { User, validate } = require("../models/user");
//const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const _ = require("lodash");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already exists");
    let usera = new User(_.pick(req.body, ["name", "email", "password"]));
    const salt = await bcrypt.genSalt(11);
    usera.password = await bcrypt.hash(usera.password, salt);

    await usera.save();

    const token = usera.generateAuthToken();

    res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token");
    res.send(_.pick(usera, ["_id", "name", "email"]));
  } catch {
    res.status(500).send("error");
  }
});

module.exports = router;
