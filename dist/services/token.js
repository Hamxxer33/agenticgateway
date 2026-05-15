"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function generateToken(domain) {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is required');
    }
    const payload = {
        domain,
        issuedAt: Date.now(),
    };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}
