import {
  createSignerFromKeypair,
  generateSigner,
  Keypair,
  percentAmount,
  Signer,
  signerIdentity,
  Umi,
} from '@metaplex-foundation/umi';
import {
  createAndMint,
  mplTokenMetadata,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import bs58 from 'bs58';
import { setupPinata } from '../util/pinataconfig';
import { PinataSDK } from 'pinata-web3';

let umi: Umi;
let userWallet: Keypair;
let userWalletSigner: Signer;
let mint: Signer;
let pinata: PinataSDK;

function initializeUmi() {
  if (umi) {
    return { umi, userWallet, userWalletSigner, mint };
  }
  umi = createUmi(
    'https://divine-necessary-scion.solana-devnet.quiknode.pro/c6f57b9e59ed38a658fa9516d87df8a8f4351ec9'
  );

  const secretKey = process.env.DEV_WALLET_SKEY
    ? bs58.decode(process.env.DEV_WALLET_SKEY)
    : null;

  if (!secretKey) {
    throw new Error('DEV_WALLET_SKEY environment variable is not set');
  }

  userWallet = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey));

  userWalletSigner = createSignerFromKeypair(umi, userWallet);

  mint = generateSigner(umi);
  umi.use(signerIdentity(userWalletSigner));
  umi.use(mplTokenMetadata());

  pinata = setupPinata();

  return { umi, userWallet, userWalletSigner, mint };
}

export { initializeUmi };

async function setupMetadata(image: string, callerName: string) {

  const uploadImage = await pinata.upload.url(image);

  const uploadMetadata = await pinata.upload.json({
    name: callerName,
    symbol: callerName.slice(0, 3).toUpperCase(),
    image: `https://turquoise-quickest-wasp-930.mypinata.cloud/ipfs/${uploadImage.IpfsHash}`,
  })

  return {
    name: callerName,
    symbol: callerName.slice(0, 3).toUpperCase(),
    uri: `https://turquoise-quickest-wasp-930.mypinata.cloud/ipfs/${uploadMetadata.IpfsHash}`,
  };
}

export async function mintToken(image: string, callerName: string) {
  try {
    initializeUmi();

    const metadata = await setupMetadata(image, callerName); //"https://trenches.fra1.cdn.digitaloceanspaces.com/profile_pictures/6255998913.jpg", "luigiscall");
    console.log("🚀 ~ mintToken ~ metadata:", metadata)

    await createAndMint(umi, {
      mint,
      authority: umi.identity,
      name: metadata.name,
      symbol: metadata.symbol,
      uri: metadata.uri,
      sellerFeeBasisPoints: percentAmount(0),
      decimals: 8,
      amount: 1000000000_00000000, // 1 billion tokens
      tokenOwner: userWallet.publicKey,
      tokenStandard: TokenStandard.Fungible,
    }).sendAndConfirm(umi);
    console.log('Successfully minted 1 billion tokens (', mint.publicKey, ')');
  } catch (err) {
    console.error('Error minting tokens:', err);
  }
}