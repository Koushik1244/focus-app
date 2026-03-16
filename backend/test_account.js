const { RpcProvider, Account } = require('starknet');
const fs = require('fs');

const RPC_URL = 'https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_9/9rfa3i4HaeOKRb0-bxNAp';
const provider = new RpcProvider({ nodeUrl: RPC_URL });

const ACCOUNT_ADDRESS = '0x0222aB8E91dB607b1DD45F5811BFe3c917671F44dB42909fF686E78702271C3a';
const PRIVATE_KEY = '0x004800d77e75f3bda82870aeade9da3d07296c8c1176eee68f076a0b97f41869';

try {
  const account = new Account(provider, ACCOUNT_ADDRESS, PRIVATE_KEY);
  fs.writeFileSync('test_result.txt', 'SUCCESS: Account created\n', 'utf8');
} catch (e) {
  const msg = 'ERROR: ' + e.message + '\nSTACK: ' + e.stack + '\n';
  fs.writeFileSync('test_result.txt', msg, 'utf8');
}
