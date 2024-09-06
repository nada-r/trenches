use anchor_lang::prelude::*;

declare_id!("BuDaqYmjD2nT7f3k4h5F2EraMQ8ed3qqeapT84c1xjXY");

#[program]
pub mod trenches {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
