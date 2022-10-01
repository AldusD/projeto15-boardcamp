import connection from "../db/db.js";
import STATUS from '../enums/status.js';
import TABLES from "../enums/tables.js";

const verifyCategory = async (req, res, next) => {
    const { name } = req.body;
    if(!name) res.sendStatus(STATUS.BAD_REQUEST);

    try {
        const conflict = await connection.query(`
        SELECT * FROM ${TABLES.CATEGORIES} WHERE name = $1 ;`, 
        [name]);
        if(conflict.rows.length >= 1) return res.sendStatus(STATUS.CONFLICT); 
    } catch (error) {
        console.log(error);
        return res.sendStatus(STATUS.SERVER_ERROR);
    }

    next();
}

export { verifyCategory };