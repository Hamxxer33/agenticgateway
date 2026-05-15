"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = verifyPayment;
const viem_1 = require("viem");
const chains_1 = require("viem/chains");
const registry_1 = require("./registry");
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const client = (0, viem_1.createPublicClient)({
    chain: chains_1.base,
    transport: (0, viem_1.http)(process.env.BASE_RPC_URL || 'https://mainnet.base.org'),
});
const transferAbi = (0, viem_1.parseAbiItem)('event Transfer(address indexed from, address indexed to, uint256 value)');
async function verifyPayment(txHash, domain) {
    try {
        const registry = (0, registry_1.getDomainRegistry)();
        const domainInfo = registry.get(domain);
        if (!domainInfo)
            return false;
        const receipt = await client.getTransactionReceipt({ hash: txHash });
        if (receipt.to !== USDC_ADDRESS)
            return false;
        const logs = receipt.logs;
        for (const log of logs) {
            if (log.address === USDC_ADDRESS) {
                const decoded = (0, viem_1.decodeEventLog)({
                    abi: [transferAbi],
                    data: log.data,
                    topics: log.topics,
                });
                if (decoded.eventName === 'Transfer') {
                    const { to, value } = decoded.args;
                    if (to.toLowerCase() === domainInfo.owner.toLowerCase() && (0, viem_1.formatUnits)(value, 6) === domainInfo.price) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    catch (error) {
        console.error('Error verifying payment:', error);
        return false;
    }
}
