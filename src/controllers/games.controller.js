import connection from "../db/db.js";
import STATUS from "../enums/status.js";

const getGames = async (req, res) => {
    const name = req.query.name || '';
    const query = `
        SELECT games.id, games.name, games.image, games."stockTotal",
        games."categoryId", games."pricePerDay", categories.name as "categoryName"  
        FROM games 
        JOIN categories ON games."categoryId" = categories.id`;
        
    try {
        const games = (name) ?
            await connection.query(`${query} WHERE games.name LIKE $1 ;`, ['%' + name + '%'])
            :
            await connection.query(query);
        
        return res.send(games.rows).status(STATUS.OK);
    } catch (error) {
        console.log(error);
        return res.sendStatus(STATUS.SERVER_ERROR);
    }
}

const createGame = async (req, res) => {
    console.log("controller")
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    try {
        const game = await connection.query(`
            INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay")
            VALUES ($1, $2, $3, $4, $5)`, [name, image, stockTotal, categoryId, pricePerDay]);
        console.log(game);
        return res.sendStatus(STATUS.CREATED);
    } catch (error) {
        console.log(error);
        return res.sendStatus(STATUS.SERVER_ERROR);
    }
}

export { getGames, createGame };