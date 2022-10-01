import connection from "../db/db.js";
import TABLES from "../enums/tables.js";
import STATUS from "../enums/status.js"; 

const getCategories = async (req, res) => {
    try {
        const categories = await connection.query(`SELECT * FROM ${TABLES.CATEGORIES};`);
        console.log(categories);
        return res.send(categories.rows).status(STATUS.OK);
    } catch (error) {
        console.log(error);
        return res.sendStatus(STATUS.SERVER_ERROR);
    }
}

const createCategory = async (req, res) => {
    const name = req.body.name;
    try {
        const category = await connection.query(
            "INSERT INTO categories (name) VALUES ($1) ;", [name]
        );
        return res.sendStatus(STATUS.CREATED);
    } catch (error) {
        console.log(error);
        return res.sendStatus(STATUS.SERVER_ERROR);
    }
}

export { getCategories, createCategory };