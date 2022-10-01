import express from 'express';

import * as controller from '../controllers/customers.controller.js';
import * as middleware from '../middlewares/customers.middlewares.js';

const router = express.Router();

router.get("/customers", controller.getCustomers);
router.get("/customers/:id", controller.getCustomerById);
router.post("/customers", middleware.verifyCustomer, controller.registerCustomer);

export default router;