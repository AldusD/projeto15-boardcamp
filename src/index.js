import express, { json } from 'express';
import cors from 'cors';

const app = express();
app.use(json(), cors());

app.listen(process.env.PORT, () => { console.log(`Chess happens on ${process.env.PORT}`) });