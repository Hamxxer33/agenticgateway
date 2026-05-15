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

app.get('/', (req, res) => {
      res.send(`<!DOCTYPE html>
      <html>
      <head>
        <meta name="virtual-protocol-site-verification" content="822c917a2d9cfba96c7aa343a5b694a1" />
          <title>Agentic Gateway</title>
          </head>
          <body>
            <pre>${JSON.stringify({
                    name: 'Agentic Gateway',
                        version: '1.0.0',
                            status: 'live',
                                docs: 'https://github.com/Hamxxer33/agenticgateway'
            }, null, 2)}</pre>
            </body>
            </html>`);
});

app.use('/verify', verifyRouter);
app.use('/registry', registryRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});