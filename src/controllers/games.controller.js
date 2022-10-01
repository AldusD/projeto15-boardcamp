import connection from "../db/db.js";
import STATUS from "../enums/status.js";

const getGames = async (req, res) => {
    try {
        const games = await connection.query(`
        SELECT 
        games.id, games.name, games.image, games."stockTotal",
        games."categoryId", games."pricePerDay", categories.name as "categoryName"  
        FROM games 
        JOIN categories ON games."categoryId" = categories.id;
        `);

        return res.send(games.rows).status(STATUS.OK);
    } catch (error) {
        console.log(error);
        return res.sendStatus(STATUS.SERVER_ERROR);
    }
}

export { getGames };