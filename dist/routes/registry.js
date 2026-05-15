"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registryRouter = void 0;
const express_1 = __importDefault(require("express"));
const registry_1 = require("../services/registry");
const router = express_1.default.Router();
exports.registryRouter = router;
router.get('/:domain', (req, res) => {
    try {
        const { domain } = req.params;
        const info = (0, registry_1.getDomainInfo)(domain);
        if (!info) {
            return res.status(404).json({ error: 'Domain not found' });
        }
        res.json(info);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/', (req, res) => {
    try {
        const { domain, price, owner } = req.body;
        if (!domain || !price || !owner) {
            return res.status(400).json({ error: 'domain, price, and owner are required' });
        }
        (0, registry_1.registerDomain)(domain, price, owner);
        res.status(201).json({ message: 'Domain registered' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
