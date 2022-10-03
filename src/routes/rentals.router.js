import express from 'express';

import * as controller from '../controllers/rentals.controller.js';
import * as middleware from '../middlewares/rentals.middleware.js';

const router = express.Router();

router.get("/rentals", controller.getRentals);
router.post("/rentals", middleware.verifyRental, middleware.verifyStock, controller.rentGame);
router.post("/rentals/:id/return", middleware.verifyRentalExistence, controller.returnGame);
router.delete("/rentals/:id", middleware.verifyRentalExistence, controller.deleteRental);

export default router;