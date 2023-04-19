const Booking = require("../models/booking");
const RoomType = require("../models/roomType");
const Room = require("../models/room");

async function getRoomTypeInfo(room_type) {
  const room_type_info = await RoomType.find({ room_type: room_type }).catch(
    (err) => {
      console.log(err);
      return err;
    }
  );

  // console.log(room_type_info[0]);
  return room_type_info[0];
}

module.exports = {
  getRoomTypeInfo,
};
