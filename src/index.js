import express, { json } from 'express';
import cors from 'cors';

import categoryRouter from './routes/categories.router.js';
import gameRouter from './routes/games.router.js';

const app = express();
app.use(json(), cors());

app.use(categoryRouter);
app.use(gameRouter);

app.listen(process.env.PORT, () => { console.log(`Chess happens on ${process.env.PORT}`) });