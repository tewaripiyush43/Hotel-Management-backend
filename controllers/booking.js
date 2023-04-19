const Booking = require("../models/booking");
const RoomType = require("../models/roomtype");
const Room = require("../models/room");

module.exports.getAllBookings = async (req, res) => {
  const bookings = await Booking.find()
    .populate("room_id", "room_number")
    .populate("room_type", "room_type price_per_hour")
    .catch((err) => {
      console.log(err);
      return err;
    });

  res.json(bookings);
};

module.exports.createBooking = async (req, res) => {
  const { user_email, room_type, start_time, end_time, total_price } = req.body;
  const room_type_info = await RoomType.find({ room_type: room_type })
    .then((res) => {
      return res[0];
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
  // console.log("Room Type:", room_type_info);

  const overlappingSlots = await Booking.find({
    $and: [
      { room_type: room_type_info._id },
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
  });
  // console.log(overlappingSlots);

  const rooms = new Set();
  let unavailableRooms = overlappingSlots.map((booking) => booking.room_id);
  overlappingSlots.map((booking) => rooms.add(booking.room_id.toString()));

  // console.log("un:", unavailableRooms);

  const availableRooms = await Room.find({
    $and: [
      { room_type_id: room_type_info._id },
      { _id: { $nin: unavailableRooms } },
    ],
  }).catch((err) => {
    console.log(err);
    return err;
  });

  if (rooms.size === room_type_info.total_rooms) {
    return res.json({
      success: false,
      message: "No room available in this slot.",
      overlappingSlots,
    });
  }

  const newBooking = new Booking({
    room_id: availableRooms[0]._id,
    user_email,
    room_type: room_type_info._id,
    start_time,
    end_time,
    total_price,
  });

  await newBooking
    .save()
    .then(() => {
      console.log("Booking saved");
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
  // console.log(availableRooms);

  return res.json({ success: true, newBooking });
};

module.exports.filterBookings = async (req, res) => {
  // console.log(req.query);
  const { room_type, start_time, end_time, room_number } = req.query;

  if (start_time !== "") {
    const overlappingSlots = await Booking.find({
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
    })
      .populate("room_id", "room_number")
      .populate("room_type", "room_type price_per_hour")
      .catch((err) => {
        console.log(err);
        return err;
      });

    return res.json(overlappingSlots);
  } else {
    const room_type_info = await RoomType.find({ room_type: room_type })
      .then((res) => {
        return res[0];
      })
      .catch((err) => {
        console.log(err);
        return err;
      });

    const room_info = await Room.findOne({
      room_number: room_number,
    }).catch((err) => {
      console.log(err);
      return err;
    });

    const bookedRooms = await Booking.find({
      room_id: room_info._id,
      room_type: room_type_info._id,
    })
      .populate("room_id", "room_number")
      .populate("room_type", "room_type price_per_hour")
      .catch((err) => {
        console.log(err);
        return err;
      });

    console.log(bookedRooms);
    return res.json(bookedRooms);
  }

  // return res.end();
};

module.exports.deleteBooking = async (req, res) => {
  await Booking.deleteOne({ _id: req.params.bookingId })
    .then(() => console.log("Booking deleted"))
    .catch((err) => {
      console.log(err);
      return err;
    });

  res.end();
};

module.exports.updateBooking = async (req, res) => {
  const {
    bookingId,
    user_email,
    room_type,
    start_time,
    end_time,
    total_price,
  } = req.body;
  // console.log(room_type);

  const room_type_info = await RoomType.find({ room_type: room_type })
    .then((res) => {
      return res[0];
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
  // console.log("Room Type:", room_type_info);

  const overlappingSlots = await Booking.find({
    $and: [
      { room_type: room_type_info._id },
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
  });

  const rooms = new Set();
  const unavailableRooms = overlappingSlots.map((booking) => booking.room_id);
  overlappingSlots.map((booking) => rooms.add(booking.room_id.toString()));

  if (rooms.size === room_type_info.total_rooms) {
    return res.status(500).json({
      message: "No room available in this slot.",
      overlappingSlots,
    });
  }

  const availableRooms = await Room.find({
    $and: [
      { room_type_id: room_type_info._id },
      { _id: { $nin: unavailableRooms } },
    ],
  }).catch((err) => {
    console.log(err);
    return err;
  });

  if (availableRooms) {
    await Booking.findByIdAndUpdate(
      { _id: bookingId },
      { user_email, start_time, end_time, total_price }
    ).catch((err) => {
      console.log(err);
      return err;
    });
  }

  res.end();
};
