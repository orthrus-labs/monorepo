<script>
  import ProtectedRoute from "../lib/ProtectedRoute.svelte";
  import ClaimableItemSample from "../lib/ClaimableItemSample.svelte";
  import ClaimableItem from "../lib/ClaimableItem.svelte";
  import MarketplaceContract from "../../../artifacts/contracts/Marketplace.sol/Marketplace.json";
  import contractConfig from "../../contract.config.js";
  import { Web3 } from "svelte-web3";
  import { getEmojis } from "../lib/Utils.svelte";

  let nfts = [];
  let claimableNfts = [];

  async function getNFTs() {
    const user = Moralis.User.current();
    const query = new Moralis.Query("PolygonNFTOwners");
    query.equalTo("owner_of", user.get("ethAddress"));
    const results = await query.find();
    nfts = results.filter((nft) => nft.attributes.contract_type == "ERC721");
  }

  async function getUserVotingPower(_userAddress, _listOfBondersForNFT) {
    console.log("list:", _listOfBondersForNFT);
    for (let i = 0; i < _listOfBondersForNFT.length; i++) {
      console.log("list element:", _listOfBondersForNFT[i]);
      if (_listOfBondersForNFT[i].user == _userAddress) {
        return _listOfBondersForNFT[i].votingPower;
      }
    }
  }

  function getOtherBonders(_userAddress, _listOfBondersForNFT, _tokenValue) {
    let otherBonders = [];
    for (let i = 0; i < _listOfBondersForNFT.length; i++) {
      let bonder = {};
      if (_listOfBondersForNFT[i].user != _userAddress) {
        bonder.bonderAddress = _listOfBondersForNFT[i].user;
        bonder.votingPower = _listOfBondersForNFT[i].votingPower;
        bonder.rewardClaimable =
          (bonder.votingPower * _tokenValue) / Math.pow(10, 18);
        otherBonders.push(bonder);
      }
    }
    return otherBonders;
  }

  async function getClaimableNFTs() {
    if (Web3) {
      // @ts-ignore
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const contract = new web3.eth.Contract(
        MarketplaceContract.abi,
        contractConfig.marketplace.mumbai.contractAddress
      );
      const accounts = await web3.eth.getAccounts();
      const idListOfUnclaimedNFTs = await contract.methods
        .getMyUnclaimedNFTs()
        .call({
          from: accounts[0],
        });
      let claimableNfts = [];
      let nftToClaim = {
        marketitemid: 0,
        totalEmojis: [],
        rewardClaimable: 0,
        soldPrice: "",
        buyer: "",
        userVotingPower: 0,
        otherBonders: [],
        tokenValue: 0,
        image: "",
      };
      for (let i = 0; i < idListOfUnclaimedNFTs.length; i++) {
        console.log(idListOfUnclaimedNFTs[i]);
        const nftInfo = await contract.methods
          .getMarketItem(idListOfUnclaimedNFTs[i])
          .call({
            from: accounts[0],
          });
        const listOfBondersForNFT = await contract.methods
          .getNFTBond(idListOfUnclaimedNFTs[i])
          .call({
            from: accounts[0],
          });
        nftToClaim.marketItemId = idListOfUnclaimedNFTs[i];
        nftToClaim.buyer = nftInfo.owner;
        nftToClaim.totalEmojis = await getEmojis(idListOfUnclaimedNFTs[i]);
        nftToClaim.userVotingPower = await getUserVotingPower(
          accounts[0],
          listOfBondersForNFT
        );
        nftToClaim.tokenValue = nftInfo.tokenValue;
        nftToClaim.rewardClaimable =
          (nftToClaim.userVotingPower * nftInfo.tokenValue) / Math.pow(10, 18);
        nftToClaim.image = await getImage(nftInfo.metadataUri);
        nftToClaim.soldPrice = nftInfo.price;
        nftToClaim.otherBonders = getOtherBonders(
          accounts[0],
          listOfBondersForNFT,
          nftInfo.tokenValue
        );
        claimableNfts.push(nftToClaim);
      }
      return claimableNfts;
    }
  }

  //TODO
  // add claim reward form that triggers contract.methods.claimReward(marketitemid)
  // show reward was claimed with a special card and show experience earned

  //EXTRA
  // show you voting power compared to the overall with a graph
  // show you overall curator profile with all the rewards earned
  async function getImage(_tokenUri) {
    try {
      const response = await fetch(_tokenUri);
      const myJson = await response.json(); //extract JSON from the http response
      return myJson.image;
    } catch (e) {
      console.log("error in getting image:", e);
    }
  }
</script>

<ProtectedRoute>
  <div
    class="grid grid-cols-1 gap-6 lg:p-10 xl:grid-cols-1 lg:bg-base-200 rounded-box"
  >
    {#await getNFTs()}
      <h1>loading...</h1>
    {:then}
      {#await getImage(nfts[0].attributes.token_uri)}
        <h1>loading...</h1>
      {:then image}
        <ClaimableItemSample {image} />
      {/await}
    {/await}
    {#await getClaimableNFTs()}
      <h1>loading claimable Nfts...</h1>
    {:then items}
      {#each items as item}
        <ClaimableItem {item} />
      {/each}
    {/await}
  </div>
</ProtectedRoute>
