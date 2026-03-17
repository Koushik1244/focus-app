const { RpcProvider, Account, Signer, ec, CallData } = require('starknet');
const fs = require('fs');
const path = require('path');

const RPC_URL = 'https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_8/9rfa3i4HaeOKRb0-bxNAp';

// Fresh OZ deployer account (no guardian, simple signing)
const PRIVATE_KEY = '0x72494a7a6411ddb42e704182f130372ca4ab96bd39f71b7bede7c00137fedf0';
const ACCOUNT_ADDRESS = '0x785fdf83d4553493d681a95066a30dbb2edbd49c45576cf8aaf2d0dabfd9cf9';
const OZ_CLASS_HASH = '0x061dac032f228abef9c6626f995015233097ae253a7f72d68552db02f2971b8f';

// Owner/treasury for BlitzEscrow constructor (your ArgentX wallet)
const OWNER_ADDRESS = '0x0222aB8E91dB607b1DD45F5811BFe3c917671F44dB42909fF686E78702271C3a';

async function deploy() {
  try {
    const provider = new RpcProvider({ nodeUrl: RPC_URL });
    const signer = new Signer(PRIVATE_KEY);
    const account = new Account({ provider, address: ACCOUNT_ADDRESS, signer });

    console.log('Deployer address:', ACCOUNT_ADDRESS);
    const chainId = await provider.getChainId();
    console.log('Connected to chain:', chainId);

    // Step 1: Deploy the OZ account itself if not already deployed
    console.log('\nChecking deployer account...');
    let accountDeployed = false;
    try {
      const classHash = await provider.getClassHashAt(ACCOUNT_ADDRESS);
      console.log('Deployer account already deployed, class hash:', classHash);
      accountDeployed = true;
    } catch {
      console.log('Deployer account not yet deployed — will deploy it first.');
    }

    if (!accountDeployed) {
      console.log('\n⚠️  Fund this address with STRK on Sepolia first:');
      console.log('   Address:', ACCOUNT_ADDRESS);
      console.log('   Faucet: https://starknet-faucet.vercel.app');
      console.log('\nWaiting for funds... (check balance)');

      const pubKey = ec.starkCurve.getStarkKey(PRIVATE_KEY);
      const deployAccountPayload = {
        classHash: OZ_CLASS_HASH,
        constructorCalldata: CallData.compile({ publicKey: pubKey }),
        contractAddress: ACCOUNT_ADDRESS,
        addressSalt: pubKey,
      };

      const { transaction_hash: accountTxHash } = await account.deployAccount(deployAccountPayload);
      console.log('Deploying OZ account, tx:', accountTxHash);
      await provider.waitForTransaction(accountTxHash);
      console.log('✅ OZ account deployed!');
    }

    // Step 2: Load contract artifacts
    const sierraPath = path.join(__dirname, '../contracts/blitz_escrow/target/dev/blitz_escrow_BlitzEscrow.contract_class.json');
    const casmPath = path.join(__dirname, '../contracts/blitz_escrow/target/dev/blitz_escrow_BlitzEscrow.compiled_contract_class.json');

    if (!fs.existsSync(sierraPath)) {
      console.log('Contract not compiled! Run: cd ../contracts/blitz_escrow && scarb build');
      return;
    }

    const sierra = JSON.parse(fs.readFileSync(sierraPath).toString('ascii'));
    const casm = JSON.parse(fs.readFileSync(casmPath).toString('ascii'));

    // Step 3: Declare
    console.log('\nDeclaring BlitzEscrow contract...');
    let classHash;
    try {
      const declareResponse = await account.declare({ contract: sierra, casm });
      classHash = declareResponse.class_hash;
      console.log('Class hash:', classHash);
      await provider.waitForTransaction(declareResponse.transaction_hash);
      console.log('Declared! Tx:', declareResponse.transaction_hash);
    } catch (err) {
      if (err.message && err.message.includes('already declared')) {
        classHash = '0x' + err.message.match(/class hash: (0x[0-9a-f]+)/i)?.[1];
        console.log('Contract already declared, class hash:', classHash);
      } else {
        // Try to extract class hash from error (contract already declared case)
        const match = JSON.stringify(err).match(/"class_hash"\s*:\s*"(0x[0-9a-fA-F]+)"/);
        if (match) {
          classHash = match[1];
          console.log('Contract already declared, class hash:', classHash);
        } else {
          throw err;
        }
      }
    }

    // Step 4: Deploy
    console.log('\nDeploying BlitzEscrow contract...');
    const deployResponse = await account.deployContract({
      classHash,
      constructorCalldata: CallData.compile({
        owner: OWNER_ADDRESS,
        treasury: OWNER_ADDRESS,
      }),
    });

    console.log('Waiting for deploy tx...');
    await provider.waitForTransaction(deployResponse.transaction_hash);
    console.log('\n✅ CONTRACT DEPLOYED!');
    console.log('Contract address:', deployResponse.contract_address);
    console.log('Tx hash:', deployResponse.transaction_hash);
    console.log('View on Starkscan: https://sepolia.starkscan.co/contract/' + deployResponse.contract_address);

  } catch (err) {
    console.error('\nDeploy error:', err.message || err);
  }
}

deploy();
