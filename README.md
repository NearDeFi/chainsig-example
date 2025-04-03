# NEAR Chain Signature Examples

This repository demonstrates how to use ChainsSignatures using NEAR's and EVM contracts. The examples include:

- EVM:
  - Signing and broadcasting transactions
  - Signing and verifying messages
  - Signing and verifying typed data
- Cosmos:
  - Signing and broadcasting transactions
- Bitcoin:
  - Signing and broadcasting transactions

## Prerequisites

- Node.js
- pnpm
- A NEAR testnet account
- A Web3 wallet (like MetaMask) for EVM interactions

## Installation

1. Clone the repository:

```bash
git clone https://github.com/sig-net/signet-examples.git
cd signet-examples
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

4. Fill in the required environment variables:

```
# General
NEXT_PUBLIC_SEPOLIA_INFURA_URL=       # Your Infura URL for Sepolia testnet

# EVM
NEXT_PUBLIC_RAINBOW_KIT_PROJECT_ID=   # Your RainbowKit project ID

# Near
NEXT_PUBLIC_NEAR_NETWORK_ID=          # e.g., testnet
NEXT_PUBLIC_NEAR_ACCOUNT=             # Your NEAR testnet account
NEXT_PUBLIC_NEAR_PRIVATE_KEY=         # Your NEAR account private key
NEXT_PUBLIC_NEAR_CHAIN_SIGNATURE_CONTRACT= # Chain signature contract address
```

## Running the Application

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Application Structure

The application features a single-page interface that allows you to switch between NEAR and EVM modes:

- **Home Page** (`/`): The main and only page that handles both NEAR and EVM interactions
  - Use the mode toggle in the header to switch between NEAR and EVM
  - Or use the query parameter `?mode=near` or `?mode=evm` to specify the mode

The interface provides buttons for:

- Sending EVM transactions
- Signing EVM messages
- Signing EVM typed data
- Sending Bitcoin transactions
- Sending Cosmos (Osmosis) transactions

## Project Structure

The project has been fully consolidated into a single-page application:

```
app/
├── _hooks/           # Shared hooks (NEAR initialization)
├── _providers/       # Shared providers (EVM/Wagmi providers)
├── page.tsx          # Main application page
└── layout.tsx        # Root layout with providers
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
