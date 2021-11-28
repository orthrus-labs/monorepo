## Contracts

The Nifty Lair contracts would allow anyone to:

* List an owned NFT for curation
* React with emojis to curate the NFT
* Claim reward when the NFT is sold

This led to the following design: 

### Marketplace.sol

* The `listNFT()` function to put your nft on sale, first needs to approve the marketplace.

* The `buyNFT()` function to buy the nft on sale.

* The `bond()` function to react with an amount to an nft.

* The `claimReward()` to claim the curation reward after an NFT is sold.