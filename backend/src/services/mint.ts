import { percentAmount, generateSigner, signerIdentity, createSignerFromKeypair } from '@metaplex-foundation/umi'
import { TokenStandard, createAndMint, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
const secret = require('../backend/dev-wallet.json');
import bs58 from "bs58";
import { pinata } from '../util/pinataconfig'

const umi = createUmi('https://divine-necessary-scion.solana-devnet.quiknode.pro/c6f57b9e59ed38a658fa9516d87df8a8f4351ec9');

const secretKey = bs58.decode(secret.skey);

const userWallet = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey));

const userWalletSigner = createSignerFromKeypair(umi, userWallet);

const mint = generateSigner(umi);
umi.use(signerIdentity(userWalletSigner));
umi.use(mplTokenMetadata())

async function setupMetadata() {
    const upload = await pinata.upload.url("https://trenches.fra1.cdn.digitaloceanspaces.com/profile_pictures/6255998913.jpg");

    const metadata = {
        name: "luigiscalls",
        symbol: "luigiscalls".slice(0, 3).toUpperCase(),//metadata.name.slice(0, 3).toUpperCase(),
        uri: `https://turquoise-quickest-wasp-930.mypinata.cloud/ipfs/${upload.IpfsHash}`,
    };

    return metadata;
}

async function mintToken() {
    try {
        const metadata = await setupMetadata();

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
        console.log("Successfully minted 1 billion tokens (", mint.publicKey, ")");
    } catch (err) {
        console.error("Error minting tokens:", err);
    }
}

mintToken();