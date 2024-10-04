use anchor_lang::prelude::*;

declare_id!("undefined");

#[program]
pub mod decentralized_asset_rag {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let rag = &mut ctx.accounts.rag;
        rag.authority = ctx.accounts.authority.key();
        rag.total_supply = 0;
        Ok(())
    }

    pub fn mint(ctx: Context<Mint>, amount: u64) -> Result<()> {
        let rag = &mut ctx.accounts.rag;
        let user = &mut ctx.accounts.user;

        rag.total_supply = rag.total_supply.checked_add(amount).unwrap();
        user.balance = user.balance.checked_add(amount).unwrap();
        Ok(())
    }

    pub fn burn(ctx: Context<Burn>, amount: u64) -> Result<()> {
        let rag = &mut ctx.accounts.rag;
        let user = &mut ctx.accounts.user;

        require!(user.balance >= amount, ErrorCode::InsufficientFunds);

        rag.total_supply = rag.total_supply.checked_sub(amount).unwrap();
        user.balance = user.balance.checked_sub(amount).unwrap();
        Ok(())
    }

    pub fn transfer(ctx: Context<Transfer>, amount: u64) -> Result<()> {
        let from = &mut ctx.accounts.from;
        let to = &mut ctx.accounts.to;

        require!(from.balance >= amount, ErrorCode::InsufficientFunds);

        from.balance = from.balance.checked_sub(amount).unwrap();
        to.balance = to.balance.checked_add(amount).unwrap();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 8)]
    pub rag: Account<'info, Rag>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Mint<'info> {
    #[account(mut)]
    pub rag: Account<'info, Rag>,
    #[account(mut)]
    pub user: Account<'info, User>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct Burn<'info> {
    #[account(mut)]
    pub rag: Account<'info, Rag>,
    #[account(mut)]
    pub user: Account<'info, User>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct Transfer<'info> {
    #[account(mut)]
    pub from: Account<'info, User>,
    #[account(mut)]
    pub to: Account<'info, User>,
    pub authority: Signer<'info>,
}

#[account]
pub struct Rag {
    pub authority: Pubkey,
    pub total_supply: u64,
}

#[account]
pub struct User {
    pub balance: u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Insufficient funds for transaction")]
    InsufficientFunds,
}