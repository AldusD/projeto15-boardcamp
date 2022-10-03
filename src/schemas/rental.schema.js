import joi from "joi";

// tonight the music seems so loud I wish that we could lose this crowd

const rentalSchema = joi.object({
    customerId: joi.number().positive(),
    gameId: joi.number().positive(),
    daysRented: joi.number().positive()
});

export default rentalSchema;