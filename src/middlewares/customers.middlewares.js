import connection from "../db/db.js";
import STATUS from "../enums/status.js";
import customerSchema from "../schemas/costumer.schema.js";

const verifyCustomerSchema = async (req, res, next) => {
    console.log("sch")
    const { name, phone, cpf, birthday } = req.body;
    const isValidCustomer = customerSchema.validate( { name, phone, cpf, birthday } );
    if(isValidCustomer.error) return res.sendStatus(STATUS.UNPROCESSABLE_ENTITY);

    res.locals.customer = { name, phone, cpf, birthday };
    console.log("sch")
    next();
}

const verifyCustomerConflict = async (req, res, next) => {
    const { name, phone, cpf, birthday } = res.locals.customer;
    const isValidCustomer = customerSchema.validate( { name, phone, cpf, birthday } );
    if(isValidCustomer.error) return res.sendStatus(STATUS.UNPROCESSABLE_ENTITY);

    try {
        const conflict = await connection.query("SELECT * FROM customers WHERE cpf = $1 ;", [cpf]);
        if(conflict.rows.length != 0) return res.sendStatus(STATUS.CONFLICT);

    } catch (error) {
        console.log(error);
        return res.sendStatus(STATUS.SERVER_ERROR);
    }

    next();
}

const verifyCustomerExistence = async (req, res, next) => {
    const { name, phone, cpf, birthday } = res.locals.customer;
    const isValidCustomer = customerSchema.validate( { name, phone, cpf, birthday } );
    if(isValidCustomer.error) return res.sendStatus(STATUS.UNPROCESSABLE_ENTITY);

    try {
        const existence = await connection.query("SELECT * FROM customers WHERE cpf = $1 ;", [cpf]);
        if(existence.rows.length === 0) return res.sendStatus(STATUS.NOT_FOUND);

    } catch (error) {
        console.log(error);
        return res.sendStatus(STATUS.SERVER_ERROR);
    }
    console.log("Ext")
    next();
}

export { verifyCustomerConflict, verifyCustomerSchema, verifyCustomerExistence };