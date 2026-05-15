import { createWalletClient, createPublicClient, http, parseUnits } from 'viem';
import { base } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const USDC_ABI = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'bool' }]
  }
] as const;

export async function sendUSDC(privateKey: string, toAddress: string, amount: string): Promise<string> {
  const account = privateKeyToAccount(privateKey as `0x${string}`);
  const client = createWalletClient({
    chain: base,
    transport: http('https://mainnet.base.org'),
    account,
  });

  const value = parseUnits(amount, 6);

  const txHash = await client.writeContract({
    address: USDC_ADDRESS,
    abi: USDC_ABI,
    functionName: 'transfer',
    args: [toAddress as `0x${string}`, value],
  });

  return txHash;
}
