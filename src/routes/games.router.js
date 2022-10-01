import express from "express";
import * as controller from "../controllers/games.controller.js";

const router = express.Router();

router.get("/games", controller.getGames);

export default router;