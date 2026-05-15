"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRouter = void 0;
const express_1 = __importDefault(require("express"));
const payment_1 = require("../services/payment");
const token_1 = require("../services/token");
const router = express_1.default.Router();
exports.verifyRouter = router;
router.post('/', async (req, res) => {
    try {
        const { txHash, domain } = req.body;
        if (!txHash || !domain) {
            return res.status(400).json({ error: 'txHash and domain are required' });
        }
        const isValid = await (0, payment_1.verifyPayment)(txHash, domain);
        if (!isValid) {
            return res.status(400).json({ error: 'Invalid payment' });
        }
        const token = (0, token_1.generateToken)(domain);
        res.json({ token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
