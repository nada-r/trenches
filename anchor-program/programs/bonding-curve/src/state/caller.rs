use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Caller {
    pub caller: Pubkey,
    pub mint_bump: u8,
    pub mint_authority_bump: u8,
    pub mint_supply: u64,
    pub mint_total_supply: u64,
    pub value_target: u64,
    pub mint_reserve: Pubkey,
    pub sol_reserve_bump: u8,
    pub bump: u8,
}
