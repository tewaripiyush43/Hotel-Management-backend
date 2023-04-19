const Room = require("../models/room");
const RoomType = require("../models/roomtype");

module.exports.createRoom = async (req, res) => {
  const { room_type, room_number } = req.body;
  //   console.log("Room created called");

  let type_id;
  type_id = await RoomType.findOne({ room_type: room_type })
    .then(async (roomType) => {
      type_id = roomType._id;
      //   console.log(type_id);

      const newRoom = new Room({
        room_type_id: type_id,
        room_number,
      });

      await newRoom
        .save()
        .then(() => {
          console.log("Room saved successfully");
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    })
    .catch((err) => {
      console.log(err);
      return err;
    });

  return res.send(newRoom);
};
