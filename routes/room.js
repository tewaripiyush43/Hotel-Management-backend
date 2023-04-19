const express = require("express");
const { createRoom } = require("../controllers/room");
const Router = express.Router();

Router.post("/create", createRoom);

module.exports = Router;
