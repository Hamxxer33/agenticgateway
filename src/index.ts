import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { verifyRouter } from './routes/verify';
import { registryRouter } from './routes/registry';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/verify', verifyRouter);
app.use('/registry', registryRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});