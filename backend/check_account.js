const { RpcProvider, ec, num } = require('starknet');
const fs = require('fs');

const RPC_URL = 'https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_9/9rfa3i4HaeOKRb0-bxNAp';
const provider = new RpcProvider({ nodeUrl: RPC_URL });
const ACCOUNT_ADDRESS = '0x0222aB8E91dB607b1DD45F5811BFe3c917671F44dB42909fF686E78702271C3a';
const PRIVATE_KEY = '0x004800d77e75f3bda82870aeade9da3d07296c8c1176eee68f076a0b97f41869';

async function check() {
  try {
    const pubKey = ec.starkCurve.getStarkKey(PRIVATE_KEY);
    fs.writeFileSync('account_info.txt', `Derived PubKey: ${pubKey}\n`, 'utf8');

    const callRes = await provider.callContract({
      contractAddress: ACCOUNT_ADDRESS,
      entrypoint: 'get_owner',
      calldata: []
    });
    fs.appendFileSync('account_info.txt', `On-chain Owner: ${callRes[0]}\n`, 'utf8');

    try {
      const guardRes = await provider.callContract({
        contractAddress: ACCOUNT_ADDRESS,
        entrypoint: 'get_guardian',
        calldata: []
      });
      fs.appendFileSync('account_info.txt', `Guardian: ${guardRes[0]}\n`, 'utf8');
    } catch (e) {
      fs.appendFileSync('account_info.txt', `get_guardian failed: ${e.message}\n`, 'utf8');
    }
  } catch (e) {
    fs.appendFileSync('account_info.txt', `Error: ${e.message}\n`, 'utf8');
  }
}
check();
