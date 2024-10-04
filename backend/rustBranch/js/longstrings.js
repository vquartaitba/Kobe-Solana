function generateRustPrompt (userTask,id) {
return `
Generate a Solana smart contract in rust code for the following task: ${userTask}. 
Answer ONLY with the Rust code for Solana smart contract codes. 
Don't add ANYTHING else. It's VERY IMPORTANT that the given CODE COMPILES. 
I now provide you an example of a rust smart contract that compiles:
use anchor_lang::prelude::*;

declare_id!("`+id +`");

#[program]
pub mod my_counter_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, number: u64) -> Result<()> {
        let state = &mut ctx.accounts.state;
        state.number = number;
        Ok(())
    }

    pub fn update(ctx: Context<Update>, number: u64) -> Result<()> {
        let state = &mut ctx.accounts.state;
        state.number = number;
        Ok(())
    }
}

#[account]
pub struct State {
    pub number: u64,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 8)]
    pub state: Account<'info, State>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub state: Account<'info, State>,
    pub user: Signer<'info>,
}
It is important that you use this ID `+id +`
This is ONLY A TEMPLATE USE IT IN YOUR FAVOR
`};




function generateImprovementPrompt(rustCode, improvementConclusions,id) {
    return `
    Based on the following Rust code for the Solana blockchain and the following anchor build output, generate an compiling version of the Solana program if needed, if it compiles dont need to change anything:
    Rust code:
    \`\`\`rust
    ${rustCode}
    \`\`\`

    anchor build output:
    \`\`\`
    ${improvementConclusions}
    \`\`\`

    Answer ONLY with the Rust code for Solana smart contract codes. Don't add ANYTHING else. It's VERY IMPORTANT that the given CODE COMPILES. I now provide you an example of a Rust smart contract that compiles:
    use anchor_lang::prelude::*;

    declare_id!("`+id +`");

    #[program]
    pub mod my_counter_program {
        use super::*;

        pub fn initialize(ctx: Context<Initialize>, number: u64) -> Result<()> {
            let state = &mut ctx.accounts.state;
            state.number = number;
            Ok(())
        }

        pub fn update(ctx: Context<Update>, number: u64) -> Result<()> {
            let state = &mut ctx.accounts.state;
            state.number = number;
            Ok(())
        }
    }

    #[account]
    pub struct State {
        pub number: u64,
    }

    #[derive(Accounts)]
    pub struct Initialize<'info> {
        #[account(init, payer = user, space = 8 + 8)]
        pub state: Account<'info, State>,
        #[account(mut)]
        pub user: Signer<'info>,
        pub system_program: Program<'info, System>,
    }

    #[derive(Accounts)]
    pub struct Update<'info> {
        #[account(mut)]
        pub state: Account<'info, State>,
        pub user: Signer<'info>,
    }
    It is important that you use this ID `+id +`
    This is ONLY A TEMPLATE USE IT IN YOUR FAVOR
    `;
}

function generateForTesting(buildingResults){
    prepromt = "Respond with 1 if all is built correctly and 0 if it has some error. For warnings or no such file or directory errors just say 1. ONLY RESPOND WITH 1 or 0. You have only one token to respond use it wasely ";
    return prepromt + buildingResults;
}

function generateTestPrompt(programCode){
    fewShot =`import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { KobeSolana } from "../target/types/kobe_solana";

describe("kobe-solana", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.KobeSolana as Program<KobeSolana>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
`
    prepromt = `I want you to make tests for the next rust Anchor program`+programCode+`using this as an example`+fewShot +`Respond ONLY and ONLY with the .ts file DO NOT add ts at the beggining`
    return prepromt
}
module.exports = { generateRustPrompt, generateImprovementPrompt,generateForTesting,generateTestPrompt};
