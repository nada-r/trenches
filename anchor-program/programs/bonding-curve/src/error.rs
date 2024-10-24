use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Caller rent is not enough")]
    CallerRent,
}
