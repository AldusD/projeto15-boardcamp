import dayjs from "dayjs";

import connection from "../db/db.js";
import STATUS from "../enums/status.js";
import TABLES from "../enums/tables.js";

const getRentals = async (req, res) => {
    const params = [];
    const customer = req.query.customerId || '';
    const game = req.query.gameId || '';

    // building filter 
    let filter = 'WHERE';
    if(customer) {
        params.push(customer);
        filter += ` "customerId" = $1`;
    } // if customer is passed then add on params and its filter on filter string
    if(customer && game) filter += "AND"; // if both parameters exist we need to add an AND operator on filter string

    if(game) {
        params.push(game);
        if(customer) {
            filter += ` games.id = $2`;
        } else filter += ` games.id = $1`;
    } // if game is passed then add on params and its filter on filter string
    
    const query = `
        SELECT 
        rentals.*, customers.name AS cname, customers.id AS cid, games.id AS gid, games.name AS gname, games."categoryId" AS gcid, categories.name AS caname
        FROM rentals JOIN customers ON rentals."customerId" = customers.id
        JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id`;      
    
    try {
        const rentals = (customer || game) ? 
            await connection.query(`${query} ${filter}`, params)
            :
            await connection.query(`${query} ;`)
        const rentalResponse = rentals.rows.map(r => (
            {
                id: r.id,
                customerId: r.customerId,
                rentDate: r.rentDate,
                daysRented: r.daysRented,
                returnDate: r.returnDate,
                originalPrice: r.originalPrice,
                delayfee: r.delayFee,
                customer: {
                    id: r.cid,
                    name: r.cname
                },
                game: {
                    id: r.gid,
                    name: r.gname,
                    categoryId: r.gcid,
                    categoryName: r.caname
                }

            }
            ))
        return res.send(rentalResponse).status(STATUS);
    } catch (error) {
        console.log(error);
        return res.sendStatus(STATUS.SERVER_ERROR);
    }
}

const rentGame = async (req, res) => {
    const { customerId, gameId, pricePerDay, daysRented } = res.locals.rental;
    const delayFee = null;
    const returnDate = null;
    const originalPrice = pricePerDay * daysRented;
    const rentDate = dayjs().format("YYYY-MM-DD");

    try {
        const rental = await connection.query(`
            INSERT INTO ${TABLES.RENTALS} 
            ("customerId", "gameId", "daysRented", "delayFee", "returnDate", "originalPrice", "rentDate")
            VALUES ($1, $2, $3, $4, $5, $6, $7)`, 
            [customerId, gameId, daysRented, delayFee, returnDate, originalPrice, rentDate]);
         
        return res.sendStatus(STATUS.CREATED);
    } catch (error) {
        console.log(error);
        return res.sendStatus(STATUS.SERVER_ERROR);
    }
}

const returnGame = async (req, res) => {
    console.log("con")
    const { id, rentDate, daysRented  } = res.locals.rental;
    const returnDate = dayjs().format('YYYY-MM-DD');
    const rentDateDJ = dayjs(rentDate)
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const delayDays = Math.floor( - daysRented - rentDateDJ.diff(returnDate) / millisecondsPerDay);
    console.log("con-log", returnDate, rentDateDJ, delayDays)

    try {
        const game = await connection.query(`
            SELECT * FROM ${TABLES.RENTALS} JOIN ${TABLES.GAMES} 
            ON ${TABLES.GAMES}.id = ${TABLES.RENTALS}."gameId" 
            WHERE ${TABLES.RENTALS}.id = $1 `, [id]);
        
        const delayFee = (delayDays > 0) ? game.rows[0].pricePerDay * delayDays : 0;

        const devolution = await connection.query(`
            UPDATE ${TABLES.RENTALS} SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3`,
            [returnDate, delayFee, id]);

        return res.sendStatus(STATUS.OK);   
        
    } catch (error) {
        console.log(error);
        return res.sendStatus(STATUS.SERVER_ERROR);
    }
}

const deleteRental = async (req, res) => {
    const { id, returnDate } = res.locals.rental;
    if(!returnDate) return res.sendStatus(STATUS.BAD_REQUEST);

    try {
        const deletion = await connection.query(`
        DELETE FROM ${TABLES.RENTALS} WHERE id = $1 ;`, [id]);

        return res.sendStatus(STATUS.OK);
    } catch (error) {
        console.log(error);
        return res.sendStatus(STATUS.SERVER_ERROR);
    }
}

export { getRentals, rentGame, returnGame, deleteRental };