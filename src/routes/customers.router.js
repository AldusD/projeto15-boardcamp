import express from 'express';

import * as controller from '../controllers/customers.controller.js';
import * as middleware from '../middlewares/customers.middlewares.js';

const router = express.Router();

router.get("/customers", controller.getCustomers);
router.post("/customers", middleware.verifyCustomerSchema, middleware.verifyCustomerConflict, controller.registerCustomer);
router.get("/customers/:id", controller.getCustomerById);
router.put("/customers/:id", middleware.verifyCustomerSchema, middleware.verifyCustomerExistence, middleware.verifyCustomerConflict, controller.updateCustomer);

export default router;