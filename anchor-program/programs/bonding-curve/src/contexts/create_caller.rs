// Import necessary modules and types
use crate::state::Caller;
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    metadata::{
        create_metadata_accounts_v3, mpl_token_metadata::types::DataV2, CreateMetadataAccountsV3,
        Metadata as Metaplex,
    },
    token::{Mint, Token, TokenAccount},
};

// Define the CreateCaller struct with its associated accounts
#[derive(Accounts)]
#[instruction(token_name: String, token_symbol: String, uri: String)]
pub struct CreateCaller<'info> {
    #[account(mut)]
    pub caller: Signer<'info>,
    #[account(
        init,
        payer = caller,
        space = 8 + Caller::INIT_SPACE,
        seeds = [b"caller", caller.key().as_ref()],
        bump,
    )]
    pub caller_account: Account<'info, Caller>,
    /// CHECK: Using seed to validate mint_authority account
    #[account(
        seeds=[b"mint_authority", caller.key().as_ref()],
        bump,
    )]
    pub mint_authority: AccountInfo<'info>,
    #[account(
        init,
        payer = caller,
        mint::decimals = 8,
        mint::authority = mint_authority,
        seeds = [b"mint", caller.key().as_ref()],
        bump,
    )]
    pub mint: Account<'info, Mint>,
    #[account(
        init,
        payer = caller,
        associated_token::mint = mint,
        associated_token::authority = mint_authority,
    )]
    pub mint_reserve: Account<'info, TokenAccount>,
    #[account(
        seeds = [b"sol_reserve", caller.key().as_ref()],
        bump,
    )]
    /// CHECK: This is not written to, it's just a PDA
    pub sol_reserve: UncheckedAccount<'info>,
    /// CHECK: This account will be initialized by the metaplex program
    #[account(
        mut,
        seeds = [
            b"metadata",
            token_metadata_program.key().as_ref(),
            mint.key().as_ref()
        ],
        bump,
        seeds::program = token_metadata_program.key(),
    )]
    /// CHECK: This account will be initialized by the metaplex program
    pub metadata: UncheckedAccount<'info>,
    pub token_metadata_program: Program<'info, Metaplex>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
}

// Implement the CreateCaller struct
impl<'info> CreateCaller<'info> {
    // Define the create_caller function
    pub fn create_caller(
        ctx: Context<CreateCaller>,
        token_name: String,
        token_symbol: String,
        uri: String,
    ) -> Result<()> {
        // Set initial values for mint supply, total supply, and value target
        let mint_supply = 1_000_000_000;
        let mint_total_supply = 1_000_000_000;
        let value_target = 1_000_000_000;

        // Create on-chain token metadata for the mint
        let data_v2 = DataV2 {
            name: token_name.to_string(),
            symbol: token_symbol.to_string(),
            uri,
            seller_fee_basis_points: 0,
            creators: None,
            collection: None,
            uses: None,
        };

        // Generate signer seeds for the mint authority
        let caller_key = ctx.accounts.caller.key();
        let seeds = &[
            b"mint_authority",
            caller_key.as_ref(),
            &[ctx.bumps.mint_authority],
        ];
        let signer = [&seeds[..]];

        // Create CPI Context for metadata creation
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_metadata_program.to_account_info(),
            CreateMetadataAccountsV3 {
                metadata: ctx.accounts.metadata.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
                mint_authority: ctx.accounts.mint_authority.to_account_info(),
                update_authority: ctx.accounts.mint_authority.to_account_info(),
                payer: ctx.accounts.caller.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
                rent: ctx.accounts.rent.to_account_info(),
            },
            &signer,
        );

        // Create metadata accounts
        create_metadata_accounts_v3(cpi_ctx, data_v2, true, true, None)?;

        // Mint tokens to the mint reserve
        anchor_spl::token::mint_to(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                anchor_spl::token::MintTo {
                    mint: ctx.accounts.mint.to_account_info(),
                    to: ctx.accounts.mint_reserve.to_account_info(),
                    authority: ctx.accounts.mint_authority.to_account_info(),
                },
                &[&[
                    b"mint_authority",
                    caller_key.as_ref(),
                    &[ctx.bumps.mint_authority],
                ]],
            ),
            mint_supply,
        )?;

        // Initialize the caller account with the necessary data
        ctx.accounts.caller_account.set_inner(Caller {
            caller: ctx.accounts.caller.key(),
            mint_bump: ctx.bumps.mint,
            mint_authority_bump: ctx.bumps.mint_authority,
            mint_supply,
            mint_total_supply,
            value_target,
            mint_reserve: ctx.accounts.mint_reserve.key(),
            sol_reserve_bump: ctx.bumps.sol_reserve,
            bump: ctx.bumps.caller_account,
        });

        Ok(())
    }
}
