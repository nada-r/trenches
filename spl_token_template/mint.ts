import { percentAmount, generateSigner, signerIdentity, createSignerFromKeypair } from '@metaplex-foundation/umi'
import { TokenStandard, createAndMint, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
const secret = require('../backend/dev-wallet.json');
import bs58 from "bs58";

const umi = createUmi('https://divine-necessary-scion.solana-devnet.quiknode.pro/c6f57b9e59ed38a658fa9516d87df8a8f4351ec9');

const secretKey = bs58.decode(secret.skey);

const userWallet = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey));

const userWalletSigner = createSignerFromKeypair(umi, userWallet);

const mint = generateSigner(umi);
umi.use(signerIdentity(userWalletSigner));
umi.use(mplTokenMetadata())

const metadata = {
    name: "luigiscalls",
    symbol: "LGC",
    uri: "https://turquoise-quickest-wasp-930.mypinata.cloud/ipfs/QmWqkf64nxiZfsLgrVBRdrp6eFAwJfSvAUYvzDnZVEkP2D",
};

createAndMint(umi, {
    mint,
    authority: umi.identity,
    name: metadata.name,
    symbol: metadata.symbol,
    uri: metadata.uri,
    sellerFeeBasisPoints: percentAmount(0),
    decimals: 8,
    amount: 1000000000_00000000,
    tokenOwner: userWallet.publicKey,
    tokenStandard: TokenStandard.Fungible,
}).sendAndConfirm(umi)
    .then(() => {
        console.log("Successfully minted 1 billion tokens (", mint.publicKey, ")");
    })
    .catch((err) => {
        console.error("Error minting tokens:", err);
    });

