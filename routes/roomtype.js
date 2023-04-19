const express = require("express");
const router = express.Router();

const {
  createRoomType,
  updateRoomType,
  deleteRoomType,
  findRoomType,
} = require("../controllers/roomtype");

router.get("/find", findRoomType);
router.post("/create", createRoomType);
router.put("/update", updateRoomType);
router.delete("/delete", deleteRoomType);

module.exports = router;
