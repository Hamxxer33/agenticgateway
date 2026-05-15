import { createPublicClient, http, parseAbiItem, formatUnits, decodeEventLog } from 'viem';
import { base } from 'viem/chains';
import { getDomainRegistry } from './registry';

const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

const client = createPublicClient({
  chain: base,
  transport: http(process.env.BASE_RPC_URL || 'https://mainnet.base.org'),
});

const transferAbi = parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)');

export async function verifyPayment(txHash: string, domain: string): Promise<boolean> {
  try {
    const registry = getDomainRegistry();
    const domainInfo = registry.get(domain);
    if (!domainInfo) return false;

    const receipt = await client.getTransactionReceipt({ hash: txHash as `0x${string}` });

    if (receipt.to !== USDC_ADDRESS) return false;

    const logs = receipt.logs;
    for (const log of logs) {
      if (log.address === USDC_ADDRESS) {
        const decoded = decodeEventLog({
          abi: [transferAbi],
          data: log.data,
          topics: log.topics,
        });
        if (decoded.eventName === 'Transfer') {
          const { to, value } = decoded.args as { to: string; value: bigint };
          if (to.toLowerCase() === domainInfo.owner.toLowerCase() && formatUnits(value, 6) === domainInfo.price) {
            return true;
          }
        }
      }
    }
    return false;
  } catch (error) {
    console.error('Error verifying payment:', error);
    return false;
  }
}