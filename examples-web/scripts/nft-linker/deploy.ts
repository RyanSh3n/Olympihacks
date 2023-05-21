import { getDefaultProvider, utils, Wallet } from 'ethers';
import { ExampleProxy__factory as ExampleProxy } from '../../src/types/factories/contracts/nft-linker/Proxy.sol'
import { ERC721Demo__factory as ERC721Demo } from '../../src/types/factories/contracts/nft-linker/ERC721demo.sol'
import { NftLinker__factory as NFTLinker} from '../../src/types/factories/contracts/nft-linker/NFTLinker.sol/'
const { deployUpgradable, deployCreate3Upgradable } = require('@axelar-network/axelar-gmp-sdk-solidity');

const nftTokenId = 0;

export async function deploy(wallet: Wallet, chainA: any, chainB: any) {
  const providerA = getDefaultProvider(chainA.rpc);
  const providerB = getDefaultProvider(chainB.rpc);
  const walletA = wallet.connect(providerA);
  const walletB = wallet.connect(providerB);

  const erc721FactoryA = new ERC721Demo(walletA);
  const erc721A = await erc721FactoryA.deploy("ATestCar", "CAR");
  chainA.erc721 = erc721A.address;

  const erc721FactoryB = new ERC721Demo(walletB);
  const erc721B = await erc721FactoryB.deploy("ATestCar", "CAR");
  chainB.erc721 = erc721B.address;

  // const hash =  await createEndpointText("hello");
  const hash = "QmWRPytfpK4NAPyVTDbQqe6hhpFm7DMpF5dF9r3BA9vDaq"; //edit this
  const metadata = `https://ipfs.io/ipfs/${hash}`;
  // const metadataPath = '/home/ryan.shen/Documents/hackathon/Olympihacks/examples-web/contracts/nft-linker/test.json'; // Update the path to your metadata file
  // const metadata = JSON.parse(readFileSync(metadataPath, 'utf-8'));

  console.log('Metadata:', metadata); // Print the metadata to the console

  await erc721A.mintWithMetadata(nftTokenId, hash, metadata)
    .then((tx: any) => tx.wait(1));

  await erc721B.mint(nftTokenId)
    .then((tx: any) => tx.wait(1));

  const salt = new Date().getTime().toString();
  const nftLinkerA = await deployCreate3Upgradable(
      chainA.create3Deployer,
      walletA,
      NFTLinker,
      ExampleProxy,
      [chainA.gateway, chainA.gasService],
      [],
      utils.defaultAbiCoder.encode(['string'], [chainA.name]),
      salt
  );
  chainA.nftLinker = nftLinkerA.address;

  const nftLinkerB = await deployCreate3Upgradable(
    chainB.create3Deployer,
    walletB,
    NFTLinker,
    ExampleProxy,
    [chainB.gateway, chainB.gasService],
    [],
    utils.defaultAbiCoder.encode(['string'], [chainB.name]),
    salt
  );
  chainB.nftLinker = nftLinkerB.address;

  return [chainA, chainB]
}

function createString(name: string, eventDetails: string, seatNumbers: string, price: string): string { 
  return `${name}_${eventDetails}_${seatNumbers}_${price}`; 
} 

function parseString(input: string): Record<string, any> {
  const [name, eventDetails, seatNumbers, price] = input.split("_"); 
  return { name, eventDetails, seatNumbers, price }; 
}