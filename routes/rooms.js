"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Room_1 = require("../models/Room");
const router = (0, express_1.Router)();
// Return all rooms
router.get("/", (_req, res) => {
    res.json(Room_1.rooms);
});
exports.default = router;
