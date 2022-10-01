import connection from "../db/db.js";
import STATUS from "../enums/status.js";
import customerSchema from "../schemas/costumer.schema.js";

const verifyCustomer = async (req, res, next) => {
    const { name, phone, cpf, birthday } = req.body;
    const isValidCustomer = customerSchema.validate( { name, phone, cpf, birthday } );
    if(isValidCustomer.error) return res.sendStatus(STATUS.UNPROCESSABLE_ENTITY);

    try {
        const conflict = await connection.query("SELECT * FROM customers WHERE cpf = $1 ;", [cpf]);
        if(conflict.rows.length != 0) return res.sendStatus(STATUS.CONFLICT);

    } catch (error) {
        console.log(error);
        return res.sendStatus(STATUS.SERVER_ERROR);
    }
    
    res.locals.customer = { name, phone, cpf, birthday };
    next();
}

export { verifyCustomer };