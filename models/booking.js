const mongoose = require("mongoose");
const moment = require("moment-timezone");

const bookingSchema = new mongoose.Schema({
  room_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  room_type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RoomType",
    required: true,
  },
  user_email: {
    type: String,
    required: true,
  },
  start_time: {
    type: Date,
    required: true,
  },
  end_time: {
    type: Date,
    required: true,
  },
  total_price: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    default: moment().tz("Asia/Kolkata").format(),
  },
  updated_at: {
    type: Date,
    default: moment().tz("Asia/Kolkata").format(),
  },
});

// bookingSchema.pre("save", function (next) {
//   const istOffset = "+05:30";
//   this.start_time = moment(this.start_time).add(istOffset).format();
//   this.end_time = moment(this.end_time).add(istOffset).format();
//   next();
// });

const Booking = new mongoose.model("Booking", bookingSchema);
module.exports = Booking;
