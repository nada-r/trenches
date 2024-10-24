import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { BondingCurve } from "../target/types/bonding_curve";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

const MPL_TOKEN_METADATA_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

describe("bonding-curve", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const provider = anchor.getProvider();
  const connection = provider.connection;
  const program = anchor.workspace.BondingCurve as Program<BondingCurve>;

  const confirm = async (signature: string): Promise<string> => {
    const block = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
      signature,
      ...block,
    });
    return signature;
  };

  const log = async (signature: string): Promise<string> => {
    console.log(
      `Your transaction signature: https://explorer.solana.com/transaction/${signature}?cluster=custom&customUrl=${connection.rpcEndpoint}`
    );
    return signature;
  };

  const caller = Keypair.generate();

  it("Airdrop to caller", async () => {
    const balanceBefore = await connection.getBalance(caller.publicKey);

    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: provider.publicKey,
        toPubkey: caller.publicKey,
        lamports: 10 * LAMPORTS_PER_SOL,
      })
    );

    await provider.sendAndConfirm(tx, []).then(log);

    const balanceAfter = await connection.getBalance(caller.publicKey);
    // expect(balanceAfter).to.greaterThan(balanceBefore);
  });

  it("Create Caller", async () => {
    const tokenName = "Test Token";
    const tokenSymbol = "TEST";
    const uri = "https://example.com/token-metadata";

    // console.log("caller", caller.publicKey.toBase58());

    const [callerAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("caller"), caller.publicKey.toBuffer()],
      program.programId
    );
    // console.log("callerAccount", callerAccount.toBase58());

    const [mint] = PublicKey.findProgramAddressSync(
      [Buffer.from("mint"), caller.publicKey.toBuffer()],
      program.programId
    );
    // console.log("mint", mint.toBase58());

    const mintAuthority = PublicKey.findProgramAddressSync(
      [Buffer.from("mint_authority")],
      program.programId
    )[0];
    // console.log("mintAuthority", mintAuthority.toBase58());

    const mintAta = getAssociatedTokenAddressSync(mint, caller.publicKey);
    // console.log("mintAta", mintAta.toBase58());

    const [solVault] = PublicKey.findProgramAddressSync(
      [Buffer.from("sol_vault"), caller.publicKey.toBuffer()],
      program.programId
    );
    // console.log("solVault", solVault.toBase58());

    const metadataAccount = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        MPL_TOKEN_METADATA_ID.toBuffer(),
        mint.toBuffer(),
      ],
      MPL_TOKEN_METADATA_ID
    )[0];
    // console.log("metadataAccount", metadataAccount.toBase58());

    console.log("Create caller");
    try {
      await program.methods
        .createCaller(tokenName, tokenSymbol, uri)
        .accounts({
          caller: caller.publicKey,
        })
        .signers([caller])
        .rpc()
        .then(confirm)
        .then(log);
    } catch (e) {
      console.error("Error creating caller:", e);
      throw e;
    }
  });
});
