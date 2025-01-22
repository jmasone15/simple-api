import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import blackjackUserRoutes from './routes/blackjackUserRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || '3001';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(cors());

app.use('/blackjack', blackjackUserRoutes);

app.listen(PORT, async () => {
	try {
		const db = await mongoose.connect(process.env.MONGODB_URI);

		console.log(`🔋 [database]: MongoDB Connected: ${db.connection.host}`);
		console.log(`⚡️ [server]: Server Listening at: http://localhost:${PORT}`);
	} catch (error) {
		console.error(error);
	}
});
