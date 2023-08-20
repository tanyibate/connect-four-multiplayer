import roomRouter from "./rooms";
import { Router } from "express";

// Combine all routers into one
const router = Router();
router.use("/rooms", roomRouter);

export default router;
