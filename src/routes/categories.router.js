import express from 'express';

import * as controller from '../controllers/categories.controller.js';
import * as middleware from '../middlewares/categories.middleware.js';

const router = express.Router();

router.get("/categories", controller.getCategories);
router.post("/categories", middleware.verifyCategory, controller.createCategory);

export default router;