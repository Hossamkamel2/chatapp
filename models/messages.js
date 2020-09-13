const mongoose = require("mongoose");
var Message = mongoose.model("Message", {
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  message: String,
});
module.exports = Message;
