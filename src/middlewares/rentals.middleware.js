import connection from "../db/db.js";
import STATUS from "../enums/status.js";
import TABLES from "../enums/tables.js";
import rentalSchema from "../schemas/rental.schema.js";

const verifyRental = async (req, res, next) => {
    console.log("mid1")
    const { customerId, gameId, daysRented } = req.body;
    const isValidRental = rentalSchema.validate( { customerId, gameId, daysRented } );
    if(isValidRental.error) return res.sendStatus(STATUS.BAD_REQUEST);

    try {

        const customerExistence = await connection.query(`
            SELECT * FROM ${TABLES.CUSTOMERS} WHERE id = $1`, [customerId]);
        if(customerExistence.rows.length === 0) return res.sendStatus(STATUS.BAD_REQUEST);

        const gameExistence = await connection.query(`
            SELECT * FROM ${TABLES.GAMES} WHERE id = $1;`, [gameId]);
        if(gameExistence.rows.length === 0) return res.sendStatus(STATUS.BAD_REQUEST);

        res.locals.rental = { customerId, gameId, daysRented, pricePerDay: gameExistence.rows[0].pricePerDay };
        res.locals.game = { ...gameExistence.rows[0] };

    } catch (error) {
        console.log(error);
        return res.sendStatus(STATUS.SERVER_ERROR);
    }
    console.log("mid")
    next();
}

const verifyStock = async (req, res, next) => {
    const { stockTotal, id } = res.locals.game;

    try {
        const gameRents = await connection.query(`
            SELECT * FROM ${TABLES.RENTALS} JOIN ${TABLES.GAMES} 
            ON ${TABLES.RENTALS}."gameId" = ${TABLES.GAMES}.id 
            WHERE ${TABLES.GAMES}.id = $1 ;`, [id]); 

        const notReturnedRents = gameRents.rows.filter(rental => (!rental.returnDate) )
        console.log(notReturnedRents.length, stockTotal)
        if(notReturnedRents.length >= stockTotal) return res.sendStatus(STATUS.BAD_REQUEST);
    
    } catch (error) {
        console.log(error);
        return res.sendStatus(STATUS.SERVER_ERROR);
    }
    next();
}

const verifyRentalExistence = async (req, res, next) => {
    const { id } = req.params;
    try {
        const rental = await connection.query(`
            SELECT * FROM ${TABLES.RENTALS} WHERE id = $1`, [id]);
        if(rental.rows.length === 0) return res.sendStatus(STATUS.NOT_FOUND);
        console.log(rental.rows)
        res.locals.rental = rental.rows[0];
    } catch (error) {
        console.log(error);
        return res.sendStatus(STATUS.SERVER_ERROR);
    }

    console.log("mid")
    next();
}

export { verifyRental, verifyStock, verifyRentalExistence };