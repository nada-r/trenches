"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var umi_1 = require("@metaplex-foundation/umi");
var mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
var umi_bundle_defaults_1 = require("@metaplex-foundation/umi-bundle-defaults");
var secret = require('../backend/dev-wallet.json');
var bs58_1 = require("bs58");
var umi = (0, umi_bundle_defaults_1.createUmi)('https://divine-necessary-scion.solana-devnet.quiknode.pro/c6f57b9e59ed38a658fa9516d87df8a8f4351ec9');
var secretKey = bs58_1.default.decode(secret.skey);
var userWallet = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey));
var userWalletSigner = (0, umi_1.createSignerFromKeypair)(umi, userWallet);
var mint = (0, umi_1.generateSigner)(umi);
umi.use((0, umi_1.signerIdentity)(userWalletSigner));
umi.use((0, mpl_token_metadata_1.mplTokenMetadata)());
var metadata = {
    name: "luigiscalls",
    symbol: "LGC",
    uri: "https://turquoise-quickest-wasp-930.mypinata.cloud/ipfs/QmWqkf64nxiZfsLgrVBRdrp6eFAwJfSvAUYvzDnZVEkP2D",
};
(0, mpl_token_metadata_1.createAndMint)(umi, {
    mint: mint,
    authority: umi.identity,
    name: metadata.name,
    symbol: metadata.symbol,
    uri: metadata.uri,
    sellerFeeBasisPoints: (0, umi_1.percentAmount)(0),
    decimals: 8,
    amount: 100000000000000000,
    tokenOwner: userWallet.publicKey,
    tokenStandard: mpl_token_metadata_1.TokenStandard.Fungible,
}).sendAndConfirm(umi)
    .then(function () {
    console.log("Successfully minted 1 billion tokens (", mint.publicKey, ")");
})
    .catch(function (err) {
    console.error("Error minting tokens:", err);
});
