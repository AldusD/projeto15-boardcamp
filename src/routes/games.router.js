import express from "express";
import * as controller from "../controllers/games.controller.js";
import * as middleware from '../middlewares/games.middleware.js';

const router = express.Router();

router.get("/games", controller.getGames);
router.post("/games", middleware.verifyGame, controller.createGame);

export default router;