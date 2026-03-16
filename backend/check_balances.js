const { RpcProvider, num, uint256 } = require('starknet');
const fs = require('fs');

const RPC_URL = 'https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_9/9rfa3i4HaeOKRb0-bxNAp';
const provider = new RpcProvider({ nodeUrl: RPC_URL });
const ACCOUNT_ADDRESS = '0x0222aB8E91dB607b1DD45F5811BFe3c917671F44dB42909fF686E78702271C3a';
const STRK_TOKEN = '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d';
const ETH_TOKEN = '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7';

async function check() {
  try {
    const strkBal = await provider.callContract({
      contractAddress: STRK_TOKEN,
      entrypoint: 'balanceOf',
      calldata: [ACCOUNT_ADDRESS]
    });
    const ethBal = await provider.callContract({
      contractAddress: ETH_TOKEN,
      entrypoint: 'balanceOf',
      calldata: [ACCOUNT_ADDRESS]
    });
    
    fs.writeFileSync('balances.txt', `STRK: ${uint256.uint256ToBN({low: strkBal[0], high: strkBal[1]}).toString()}\n`, 'utf8');
    fs.appendFileSync('balances.txt', `ETH: ${uint256.uint256ToBN({low: ethBal[0], high: ethBal[1]}).toString()}\n`, 'utf8');
  } catch (e) {
    fs.writeFileSync('balances.txt', `Error: ${e.message}\n`, 'utf8');
  }
}
check();
