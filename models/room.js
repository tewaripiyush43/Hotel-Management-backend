const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  room_type_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RoomType",
    required: true,
  },
  room_number: {
    type: String,
    unique: true,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const istOffset = 330; // offset in minutes for IST

roomSchema.pre("save", function (next) {
  const now = new Date();
  const istTime = new Date(now.getTime() + istOffset * 60 * 1000);
  if (!this.created_at) {
    this.created_at = istTime
      .toISOString()
      .replace("T", " ")
      .replace(/\.\d+Z$/, "");
  }
  this.updated_at = istTime
    .toISOString()
    .replace("T", " ")
    .replace(/\.\d+Z$/, "");
  next();
});

const Room = new mongoose.model("Room", roomSchema);
module.exports = Room;
