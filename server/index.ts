import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from './generated/prisma'

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(express.json());


const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});