<script>
  import ProtectedRoute from "../lib/ProtectedRoute.svelte";
  import ClaimableItem from "../lib/ClaimableItem.svelte";
  import MarketplaceContract from "../../../artifacts/contracts/Marketplace.sol/Marketplace.json";
  import contractConfig from "../../contract.config.js";
  import { Web3 } from "svelte-web3";

  let nfts = [];

  async function getNFTs() {
    const user = Moralis.User.current();
    const query = new Moralis.Query("PolygonNFTOwners");
    query.equalTo("owner_of", user.get("ethAddress"));
    const results = await query.find();
    const nftsR = results.filter(
      (nft) => nft.attributes.contract_type == "ERC721"
    );
    nfts = nftsR;
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
      const receipt = await contract.methods.getMyUnclaimedNFTs().call({
        from: accounts[0],
      });
      let claimableNfts = [];
      for (let i = 0; i < receipt.length; i++) {
        console.log(receipt[i]);
        const res = await contract.methods.getMarketItem(receipt[i]).call({
          from: accounts[0],
        });
        claimableNfts.push(res);
        console.log(res);
      }
      console.log("claimableNfts:", claimableNfts);
      // TODO create new array of objects which contains:
      /*claimbleNFT: {
          marketitemid: 1,
          totalEmojis: [0,1,1,1],
          rewardClaimable: "10 Matic",
          soldPrice: "1000 Matic",
          buyer: "0x810DD92Ad0c199a7B364Fb324E97dac5e5014C5D",
          votingPower: 100,
          otherBonders: [{ 
              bonderAddress: "0x990DD92Ad0c199a7B364Fb324E97dac5e5014C5D"
              votingPower: 200,
              rewardClaimable: "20 Matic"
          }]
        }
      */
      //return receipt;
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
  {#await getNFTs()}
    <h1>loading...</h1>
  {:then}
    <div
      class="grid grid-cols-1 gap-6 lg:p-10 xl:grid-cols-1 lg:bg-base-200 rounded-box"
    >
      {#await getImage(nfts[0].attributes.token_uri)}
        <h1>loading...</h1>
      {:then image}
        <ClaimableItem {image} />
      {/await}
    </div>
  {/await}
</ProtectedRoute>
