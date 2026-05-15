import express from 'express';
import { getDomainInfo, registerDomain } from '../services/registry';

const router = express.Router();

router.get('/:domain', (req, res) => {
  try {
    const { domain } = req.params;
    const info = getDomainInfo(domain);

    if (!info) {
      return res.status(404).json({ error: 'Domain not found' });
    }

    res.json(info);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', (req, res) => {
  try {
    const { domain, price, owner }: { domain: string; price: string; owner: string } = req.body;

    if (!domain || !price || !owner) {
      return res.status(400).json({ error: 'domain, price, and owner are required' });
    }

    registerDomain(domain, price, owner);

    res.status(201).json({ message: 'Domain registered' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as registryRouter };