import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SoccerGame } from "../target/types/soccer_game";
import { expect } from 'chai';

describe("soccer-game", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SoccerGame as Program<SoccerGame>;

  let gameAccount: anchor.web3.Keypair;

  beforeEach(async () => {
    gameAccount = anchor.web3.Keypair.generate();
  });

  it("Initializes the game", async () => {
    const tx = await program.methods
      .initializeGame("Team A", "Team B")
      .accounts({
        game: gameAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([gameAccount])
      .rpc();

    const gameState = await program.account.game.fetch(gameAccount.publicKey);
    expect(gameState.team1).to.equal("Team A");
    expect(gameState.team2).to.equal("Team B");
    expect(gameState.isActive).to.be.true;
  });

  it("Adds players to teams", async () => {
    await program.methods
      .initializeGame("Team A", "Team B")
      .accounts({
        game: gameAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([gameAccount])
      .rpc();

    await program.methods
      .addPlayer(1, "Player 1")
      .accounts({
        game: gameAccount.publicKey,
        user: provider.wallet.publicKey,
      })
      .rpc();

    await program.methods
      .addPlayer(2, "Player 2")
      .accounts({
        game: gameAccount.publicKey,
        user: provider.wallet.publicKey,
      })
      .rpc();

    const gameState = await program.account.game.fetch(gameAccount.publicKey);
    expect(gameState.team1Players).to.include("Player 1");
    expect(gameState.team2Players).to.include("Player 2");
  });

  it("Scores goals", async () => {
    await program.methods
      .initializeGame("Team A", "Team B")
      .accounts({
        game: gameAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([gameAccount])
      .rpc();

    await program.methods
      .scoreGoal(1)
      .accounts({
        game: gameAccount.publicKey,
        user: provider.wallet.publicKey,
      })
      .rpc();

    await program.methods
      .scoreGoal(2)
      .accounts({
        game: gameAccount.publicKey,
        user: provider.wallet.publicKey,
      })
      .rpc();

    const gameState = await program.account.game.fetch(gameAccount.publicKey);
    expect(gameState.team1Score).to.equal(1);
    expect(gameState.team2Score).to.equal(1);
  });

  it("Records fouls", async () => {
    await program.methods
      .initializeGame("Team A", "Team B")
      .accounts({
        game: gameAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([gameAccount])
      .rpc();

    await program.methods
      .recordFoul(1)
      .accounts({
        game: gameAccount.publicKey,
        user: provider.wallet.publicKey,
      })
      .rpc();

    await program.methods
      .recordFoul(2)
      .accounts({
        game: gameAccount.publicKey,
        user: provider.wallet.publicKey,
      })
      .rpc();

    const gameState = await program.account.game.fetch(gameAccount.publicKey);
    expect(gameState.team1Fouls).to.equal(1);
    expect(gameState.team2Fouls).to.equal(1);
  });

  it("Ends the game", async () => {
    await program.methods
      .initializeGame("Team A", "Team B")
      .accounts({
        game: gameAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([gameAccount])
      .rpc();

    await program.methods
      .endGame()
      .accounts({
        game: gameAccount.publicKey,
        user: provider.wallet.publicKey,
      })
      .rpc();

    const gameState = await program.account.game.fetch(gameAccount.publicKey);
    expect(gameState.isActive).to.be.false;
  });
});