import express from 'express';
import { verifyPayment } from '../services/payment';
import { generateToken, validateToken } from '../services/token';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { txHash, domain }: { txHash: string; domain: string } = req.body;

    if (!txHash || !domain) {
      return res.status(400).json({ error: 'txHash and domain are required' });
    }

    const isValid = await verifyPayment(txHash, domain);

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid payment' });
    }

    const token = generateToken(domain);

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/validate', (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const bodyToken = req.body?.token;
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : bodyToken;

    if (!token) {
      return res.json({ valid: false });
    }

    const valid = validateToken(token);
    res.json({ valid });
  } catch (error) {
    console.error(error);
    res.json({ valid: false });
  }
});

export { router as verifyRouter };