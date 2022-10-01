import connection from "../db/db.js";
import STATUS from "../enums/status.js";

const getCustomers = async (req, res) => {
    const search = req.query.cpf || '';
    const query = 'SELECT * FROM customers';
    try {
        const games = (search) ? 
        await connection.query(`${query} WHERE cpf LIKE $1;`, [search + '%'])
        :
        await connection.query(query);

        return res.send(games.rows).status(STATUS.OK);
        
    } catch (error) {
        console.log(error);
        return res.sendStatus(STATUS.SERVER_ERROR);
    }
}

const getCustomerById = async (req, res) => {
    const id = req.params.id;

    try {
        const customer = await connection.query("SELECT * FROM customers WHERE id = $1 LIMIT 1", [id]);        
        if(customer.rows.length === 0) return res.sendStatus(STATUS.NOT_FOUND);
        return res.send(customer.rows).status(STATUS.OK);    
    } catch (error) {
        console.log(error);
        return res.sendStatus(STATUS.SERVER_ERROR);
    }
}

const registerCustomer = async (req, res) => {
    const { name, phone, cpf, birthday } = res.locals.customer;

    try {
        const customer = await connection.query(`
            INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)`, 
            [name, phone, cpf, birthday]);

        return res.sendStatus(STATUS.OK);    
    } catch (error) {
        console.log(error);
        return res.sendStatus(STATUS.SERVER_ERROR);
    }
}

export { getCustomers, getCustomerById, registerCustomer };