const Booking = require("../models/booking");
const RoomType = require("../models/roomType");
const Room = require("../models/room");

async function findOverlapings({ room_id, start_time, end_time }) {
  console.log(room_id);
  const overlappingSlots = await Booking.find({
    $and: [
      { room_type: room_id },
      {
        $or: [
          {
            $and: [
              { start_time: { $gte: start_time } },
              { end_time: { $lte: end_time } },
            ],
          },
          {
            $and: [
              { start_time: { $lt: start_time } },
              { end_time: { $gt: start_time } },
            ],
          },
          {
            $and: [
              { start_time: { $lt: end_time } },
              { end_time: { $gt: end_time } },
            ],
          },
        ],
      },
    ],
  }).populate("room_id", "room_number _id");
  // console.log(overlappingSlots);

  return overlappingSlots;
}

module.exports = {
  findOverlapings,
};
