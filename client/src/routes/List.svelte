<script>
// @ts-nocheck
import { onMount } from 'svelte';
let photos = [];

    import {
        Web3
    } from 'svelte-web3'
    import MarketplaceContract from '../../../artifacts/contracts/Marketplace.sol/Marketplace.json'
    let nfts = []

    async function getNFTs() {
      console.log("get NFTS")
    const user = Moralis.User.current()
    console.log("user")
  // create query
  const query = new Moralis.Query("PolygonNFTOwners");
  query.equalTo("owner_of", user.get("ethAddress"));
  // run query
  console.log("query:", query)
  const results = await query.find();
   nfts = results.filter(nft => nft.attributes.contract_type == "ERC721")
  results.forEach((nft) => {
    console.log("contract:", nft.attributes)
  })
  console.log(nfts)
    }

onMount( async () => {
   nfts = await getNFTs()
 
})

   let _tokenId, _metadataUri, _price
    async function listNFT(_tokenId) {
        if (Web3) {
            // @ts-ignore
            const web3 = new Web3(window.ethereum)
            console.log("web3")
            const networkId = await web3.eth.net.getId()
            console.log("networkId:", networkId)
            const contract = new web3.eth.Contract(
                MarketplaceContract.abi,
                "0x69F317DB35CbEf869701373437371beaE3aF2039"
            );
            const accounts = await web3.eth.getAccounts()
            console.log('accounts:',accounts)
            console.log("tokenId", _tokenId)
            await contract.methods.listNFT("0x69F317DB35CbEf869701373437371beaE3aF2039", web3.utils.toWei(_tokenId, 'ether'), "test", web3.utils.toWei('1', 'ether')).send({from: accounts[0]})
        }
    }
    $: promise2 = listNFT()
</script>

<div>
  <div class="form-control">
    <label class="label">
      <span class="label-text">medium</span>
    </label> 
    <label class="input-group input-group-md">
      <input bind:value={_tokenId} type="text" class="input input-bordered input-md"> 
      <span>_tokenId</span>
    </label>
  </div> 
  <button on:click={listNFT(_tokenId)}>List NFT</button> 
  { #each nfts as item (item)}
  <div class="card bordered">
    <figure>
      <img src="https://picsum.photos/id/1005/400/250">
    </figure> 
    <div class="card-body">
      <h2 class="card-title">{item.attributes.name}
        <div class="badge mx-2 badge-secondary">{item.attributes.token_id}</div>
      </h2> 
      {console.log("token uri:", item.attributes.token_uri)}
      <img src={item.attributes.token_uri}>

      <div class="justify-end card-actions">
        <button on:click={listNFT(item.attributes.token_id)} class="btn btn-secondary">List NFT</button>
      </div>
    </div>
  </div> 
  { /each}
</div>