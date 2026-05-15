import express from 'express';
import { verifyPayment } from '../services/payment';
import { generateToken } from '../services/token';

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

export { router as verifyRouter };