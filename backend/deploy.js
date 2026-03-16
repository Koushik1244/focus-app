const { RpcProvider, Account, hash, Signer } = require('starknet');
const fs = require('fs');
const path = require('path');

const RPC_URL = 'https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_9/9rfa3i4HaeOKRb0-bxNAp';
const ACCOUNT_ADDRESS = '0x0222aB8E91dB607b1DD45F5811BFe3c917671F44dB42909fF686E78702271C3a';
const PRIVATE_KEY = '0x004800d77e75f3bda82870aeade9da3d07296c8c1176eee68f076a0b97f41869';

async function deploy() {
  try {
    const provider = new RpcProvider({ nodeUrl: RPC_URL });
    const signer = new Signer(PRIVATE_KEY);
    const account = new Account({ provider, address: ACCOUNT_ADDRESS, signer, cairoVersion: '1' });

    console.log('Account address:', ACCOUNT_ADDRESS);
    console.log('Checking connection...');
    const chainId = await provider.getChainId();
    console.log('Connected to chain:', chainId);

    const sierraPath = path.join(__dirname, '../contracts/blitz_escrow/target/dev/blitz_escrow_BlitzEscrow.contract_class.json');
    const casmPath = path.join(__dirname, '../contracts/blitz_escrow/target/dev/blitz_escrow_BlitzEscrow.compiled_contract_class.json');

    if (!fs.existsSync(sierraPath)) {
      console.log('Contract not compiled! Run: cd ../contracts/blitz_escrow && scarb build');
      return;
    }

    const sierra = JSON.parse(fs.readFileSync(sierraPath).toString('ascii'));
    const casm = JSON.parse(fs.readFileSync(casmPath).toString('ascii'));

    console.log('Declaring contract (V3)...');
    const declareResponse = await account.declare(
      { contract: sierra, casm: casm },
      { version: 3 }
    );
    console.log('Class hash:', declareResponse.class_hash);

    console.log('Waiting for declare tx...');
    await provider.waitForTransaction(declareResponse.transaction_hash);
    console.log('Declared! Tx:', declareResponse.transaction_hash);

    console.log('Deploying contract (V3)...');
    const deployResponse = await account.deployContract({
      classHash: declareResponse.class_hash,
      constructorCalldata: [ACCOUNT_ADDRESS, ACCOUNT_ADDRESS],
    }, { version: 3 });

    console.log('Waiting for deploy tx...');
    await provider.waitForTransaction(deployResponse.transaction_hash);
    console.log('✅ CONTRACT DEPLOYED!');
    console.log('Contract address:', deployResponse.contract_address);
    console.log('Tx hash:', deployResponse.transaction_hash);
    console.log('View on Starkscan: https://sepolia.starkscan.co/contract/' + deployResponse.contract_address);

  } catch (err) {
    console.error('Deploy error:', err.message);
    console.error('Full error:', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
  }
}

deploy();
