const express = require("express");
const {
  createBooking,
  getAllBookings,
  filterBookings,
  deleteBooking,
  updateBooking,
} = require("../controllers/booking");
const Router = express.Router();

Router.get("/getBookings", getAllBookings);
Router.get("/filterBookings", filterBookings);
Router.post("/create", createBooking);
Router.delete("/delete/:bookingId", deleteBooking);
Router.put("/update", updateBooking);

module.exports = Router;
