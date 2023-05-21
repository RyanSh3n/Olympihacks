NOTE: RUN OUR APPLICATION THE SAME WAY YOU WOULD RUN AXELAR EXAMPLES
https://testnet.axelarscan.io/gmp/0xe071f496d5f657a0cbb635e6a21a20cc597ec1403c16cf7c7326551525002469

POSITIVE EXPERIENCE:
As a team completely new to blockchain, we thoroughly enjoyed not only learning what blockchain is, but also the incredible possibilities and applications it has in our everyday lives. We loved diving deep into the world of interchain and learning about the value of general message passing through building a project with Axelar. We also love the passion that Stephen Fluin brought in every interation with us hackers <3

NEGATIVE EXPERIENCE:
Although we love to be challenged, interchain tech proved to be especially difficult to get a hang of. There was a very steep learning curve and we would really appreciate more beginner-friendly workshops and documentation.

# Axelar cross-chain dApp examples

## Introduction

This repo provides the code for several example dApps in the [Axelar Local Development Environment](https://github.com/axelarnetwork/axelar-local-dev). Examples contain both JavaScript and Solidity smart contract code.

**Note:** Some example folders in this repo are not documented.

## One-time setup

Install [nodejs](https://nodejs.org/en/download/). Run `node -v` to check your installation.

Support Node.js version 16.x and 18.x

1. Clone this repo:

```bash
git clone https://github.com/axelarnetwork/axelar-examples.git
```

2. Install dependencies:

```bash
npm install
```

3. Compile smart contracts:

```bash
npm run build
```

## Set environment variables

You can get started quickly with a random local key and `.env` file by running

```bash
npm run setup
```

Or you can manually copy the example `.env.example` file and fill in your EVM private key. See the [example Metamask Instructions](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key) for exporting your private keys.

```bash
cp .env.example .env
```

Then update to your own private key.

## Print wallet balances

This script will print your wallet balances for each chain.

```bash
npm run check-balance [local|testnet]
```

If not specified, this will print balances of the wallet for testnet.

## Running the local chains

```bash
npm run start
```

Leave this node running on a separate terminal before deploying and testing the dApps.

## Examples

-   [Evm Examples](/examples/evm/)
-   [Aptos Examples](/examples/aptos/)
-   [Web Examples](/examples-web/)
