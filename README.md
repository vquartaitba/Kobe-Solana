# Kobe

## Presentation

[Kobe - Presentation](https://www.figma.com/slides/tmOQDZXXDg6shYu2XgL9BQ/kobe-deck-solana?node-id=1-305&node-type=slide)

[Video introducing Kobe](https://www.youtube.com/watch?v=zvIfosxRu8A)

## Description

This project is a developer tool designed for the blockchain ecosystem, powered by Large Language Models (LLMs). The tool provides a seamless interface for developers to interact with the model, offering a range of features to enhance the blockchain development experience. Whether you're generating code, testing it, compiling, deploying, or seeking the latest information in the blockchain space, this tool has you covered.

With Kobe, anyone can automate the creation and development of a smart contract, from generation to deployment on Solana, all within one environment.

## Features

- **Smart Contract Generation**: Automatically generates contracts for Solana using artificial intelligence.
- **Testing and Validation**: Validates and tests the generated smart contracts before deployment.
- **Compilation and Deployment**: Compiles and deploys contracts directly onto the Solana blockchain from the tool.
- **Real-Time Information**: Access the latest blockchain updates through Retrieval-Augmented Generation (RAG) technologies, ensuring you're always up-to-date.

## Installation

To generate, compile, and deploy contracts on the Solana blockchain using Kobe, follow these steps:

### Prerequisites for using Kobe

Make sure you have the following tools installed on your system:

1. **Node.js and npm**: Kobe uses npm to handle frontend dependencies.
   - Install Node.js and npm [here](https://nodejs.org/en/download/), or with a package manager like `nvm`:
     ```bash
     nvm install node
     ```

2. **Yarn**: Yarn is a package manager that helps manage frontend dependencies efficiently.
   - Install Yarn globally using npm:
     ```bash
     npm install -g yarn
     ```

3. **Solana CLI**: Required to interact with the Solana blockchain, including compiling and deploying Rust-based smart contracts.
   - Install Solana CLI by running:
     ```bash
     sh -c "$(curl -sSfL https://release.solana.com/v1.14.17/install)"
     ```
     More details can be found in the official documentation: [Solana CLI - download](https://docs.solana.com/cli/install-solana-cli-tools).

4. **Rust**: Ensure that the Rust compiler is available in your environment, as Solana smart contracts are written in Rust.
   - Install Rust by running:
     ```bash
     curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
     ```
     You can verify the installation with:
     ```bash
     rustc --version
     ```
     For more information, check the official [Rust installation guide](https://www.rust-lang.org/tools/install).

5. **Anchor Framework**: Anchor simplifies Solana smart contract development. You can install Anchor with:
   ```bash
   cargo install --git https://github.com/project-serum/anchor anchor-cli --locked


### Installation Steps

1. Run `yarn install` at the root of the project to install the dependencies.

2. Navigate to the `frontend` directory and run:
   ```bash
   npm run build
   ```

3. Start the frontend application:
   ```bash
   npm start
   ```

4. In another terminal, run the backend service:
   ```bash
   node backend/redireccionador/index.js
   ```

## API Keys

Kobe is powered by large language models (LLMs). Therefore, it is necessary to provide the API keys for the services we use to access these capabilities (Claude-Anthropic and GPT-OpenAI). Add the required keys to the `.env` file in the root of the project.

### Disclaimer

If you do not wish to use the RAG functionality (which helps keep you updated with the latest Solana developments), you can comment out or remove the following code snippet in the file `backend/ragBranch/index.js`:

```javascript
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SUPABASE_URL = "https://eajrvhzuisvfdqkobved.supabase.co";

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

## External Resources

This project leverages the power of the Solana blockchain to generate, compile, and deploy smart contracts using the Rust language quickly, securely, and efficiently.

## User Conversations Data

We are committed to protecting user data. All information generated in conversations is handled securely and will never be shared.
