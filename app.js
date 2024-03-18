import 'dotenv/config';
import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import passport from "./passport/passport.jwt.js";

import sessionsRouter from './routes/sessions.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use(cookieParser(process.env.SECRET_COOKIE));

app.use('/api/sessions', sessionsRouter);

mongoose.connect(`${process.env.MONGO_URL}/ecommerce`)
	.then(db => console.log('DB is connected'))
	.catch(error => console.log(error));

app.listen(4000, () => {
	console.log('Server on port 4000');
});