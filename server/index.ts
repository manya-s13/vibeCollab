import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'
import router from './routes';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});