# 🖼 dExhibition

&nbsp;

This repo is to demonstrate how you would set up the dExhibition environment using Hardhat & Svelte. Head on over to the `./test` folder to examine the javascript files that thoroughly test the smart-contract, which latter you will find in `./contracts`.

&nbsp;

## :page_with_curl:  _Instructions_

**1)** Fire up your favorite console & clone this repo somewhere:

__`❍ git clone https://github.com/the-nifty-lair/monorepo.git`__

**2)** Enter this directory & install dependencies:

__`❍ cd monorepo && npm install`__

**3)** Launch Hardhat test:

__`❍ npx hardhat test`__

**4)** Enter the client directory & install dependencies:

__`❍ cd client && npm install`__

**5)** Run the front-end

__`❍ npm run dev`__

&nbsp;

## 💡 _Inspiration_

The project takes inspiration from the current NFT trends, the desire for a decentralized social network, the mechanics behind marketplaces, and the game theory of derivatives; we are so excited to present dExhibition, a decentralized NFT social network for curators. 

&nbsp;
 
## 🛸 _What it does_

The platform dExhibition allows NFTs to be not just static elements of a marketplace but brings them to life empowering curators to be rewarded for their curation job on the platform by getting a cut on the curated NFT sale.

From a **Defi perspective**, dExhibition can also be seen as an NFT derivative exchange where the NFT is the underlying asset and the curation value staked it is the NFT derivative.

Since we are not looking to create another whale platform, the quadratic formula behind the reward calculation prevents users with big capital to outclass normal users.

&nbsp;

## 🛸 _How we built it_

For the on-chain part we are relying on our Marketplace.sol Solidity smart contract, which it is in charge of:

* Allowing users to **buy** an NFT
* Allowing curators to **react by bonding** value - the position of the bonded value of the NFT is represented in the form of ERC1155 minted to the curator 
* Allowing curators to **claim a reward** once the NFT is sold - ERC1155 representing the bonding are burned to claim the reward.

The contract is live on Mumbai **Polygon testnet** at: 

  * Marketplace: `0x18af824E41b37dE3a92a9599854ED407A76ff514`
  * Erc20address (our custom version of DAI):  `0xE60e6676eCB09bC095D36AB83B46C4695F79372d`
  * Erc1155address (token representing a reaction on an NFT + value in $DAI): `0x4459c282299C439D6915e0a37Fed30e045c431bC`

We have used **Chainlink External Adapter** to use the API Endpoint as a Wolfram to calculate what we identify as the Curator Voting Power, which is the amount of the reward the curator is entitled to.

The contract is fully tested including the Chainlink External Adapter by using the contracts mocks available on the Chainlink Github.

For the front-end, we have used Svelte + TailwindCSS + Daisy UI.

We are using **Moralis API** to retrieve users & NFTs information in a smooth way.

&nbsp;

## 🔧 🚧 _Challenges we ran into_

Coming out with a decent formula for the voting power calculation was challenging. Chainlink helped us a lot here since the on-chain solution we came out with was very expensive in terms of gas. Since we are planning a launch on Ethereum other than Polygon, this allows saving a lot in fees.

&nbsp;

## 💪 _Accomplishments that we're proud of_

Building a working service with on-chain contracts and nice front-end UI in one month is something we are extremely proud of. This is also the first time we were working together as a team. 

&nbsp;

## 👩‍🏫 _What we learned_

* Complete Chainlink flow
* Moralis is so easy to integrate and makes the whole process of retrieving information about users and NFTs so smooth.
* Derivatives mechanics

&nbsp;

## 🚀 _What's next for DExhibition_

* Launch on Polygon Mainnet!