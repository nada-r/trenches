use anchor_lang::prelude::*;

pub mod contexts;
pub mod error;
pub mod state;

use contexts::*;

declare_id!("J8bgMduAt7kgqN4htuCU2WwHEuPNPWnxGkNLe2kiCwyq");

#[program]
pub mod bonding_curve {

    use super::*;

    pub fn create_caller(
        ctx: Context<CreateCaller>,
        token_name: String,
        token_symbol: String,
        uri: String,
    ) -> Result<()> {
        CreateCaller::create_caller(ctx, token_name, token_symbol, uri)?;

        Ok(())
    }
}
