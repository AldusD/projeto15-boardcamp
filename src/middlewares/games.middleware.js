import connection from "../db/db.js";
import STATUS from "../enums/status.js";
import gameSchema from "../schemas/game.schema.js";

const verifyGame = async (req, res, next) => {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
    const isValidGame = gameSchema.validate( { name, image, stockTotal, categoryId, pricePerDay } );
    if(isValidGame.error) return res.sendStatus(STATUS.UNPROCESSABLE_ENTITY);

    try {
        const isValidCategory = await connection.query(`
            SELECT * FROM categories WHERE id = $1;`, [categoryId]);
        if(isValidCategory.rows.length === 0) return res.sendStatus(STATUS.UNPROCESSABLE_ENTITY);

        const gameConflict = await connection.query(`
            SELECT * FROM games WHERE name = $1;`, [name]);
        if(gameConflict.rows.length !== 0) return res.sendStatus(STATUS.CONFLICT);

        } catch (error) {
        console.log(error);
        res.sendStatus(STATUS.SERVER_ERROR);
    }
    next();
}

export { verifyGame };