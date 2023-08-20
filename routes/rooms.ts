import { Router } from "express";
import { rooms } from "../models/Room";
const router = Router();

// Return all rooms
router.get("/", (_req, res) => {
  res.json(rooms);
});

export default router;
