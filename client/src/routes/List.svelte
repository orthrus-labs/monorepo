<script>
  import { onMount } from "svelte";
  import ProtectedRoute from "../lib/ProtectedRoute.svelte";
  import { Web3 } from "svelte-web3";
  import MarketplaceContract from "../../../artifacts/contracts/Marketplace.sol/Marketplace.json";
  import tyson2 from "../images/tyson2.png";
  let nfts = [];

  async function getNFTs() {
    const user = Moralis.User.current();
    const query = new Moralis.Query("PolygonNFTOwners");
    query.equalTo("owner_of", user.get("ethAddress"));
    const results = await query.find();
    const nftsR = results.filter(
      (nft) => nft.attributes.contract_type == "ERC721"
    );
    return nftsR;
  }

  onMount(async () => {
    nfts = await getNFTs();
    console.log("nfts:", nfts.attributes);
  });

  async function getImage(_tokenUri) {
    try {
      const response = await fetch(_tokenUri);
      const myJson = await response.json(); //extract JSON from the http response
      return myJson.image;
    } catch (e) {
      console.log("error in getting image:", e);
    }
  }

  let _tokenId, _metadataUri, _price;
  async function listNFT(_contractAddress, _tokenId) {
    if (Web3) {
      // @ts-ignore
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const contract = new web3.eth.Contract(
        MarketplaceContract.abi,
        "0xef1e49862C584AD68EADbB7e66368Aa5fde79062"
      );
      const accounts = await web3.eth.getAccounts();
      const receipt = await contract.methods
        .listNFT(_contractAddress, 1, "test", web3.utils.toWei("1", "ether"))
        .send({
          from: accounts[0],
        });
      console.log(receipt);
    }
  }
  $: promise2 = listNFT();
</script>

<ProtectedRoute>
  <div class="grid grid-cols-3 mx-auto px-4 md:max-w-10xl">
    {#each nfts as item (item)}
      <div class="p-2 m-3 border-2 h-20px">
        {#await getImage(item.attributes.token_uri)}
          {console.log("loading img")}
        {:then image}
          <figure>
            {#if image}
              <img class="bg-gray-100 h-xl object-contain w-full" src={image} />
            {:else}
              <img
                class="bg-gray-100 h-xl object-contain w-full"
                src={tyson2}
              />
            {/if}
          </figure>
        {/await}
        <div class="card-body">
          <h2 class="card-title">
            {item.attributes.name}
            <div class="badge mx-2 badge-secondary">
              {item.attributes.token_id}
            </div>
          </h2>
          <div class="justify-end card-actions">
            <button
              on:click={listNFT(
                item.attributes.token_address,
                item.attributes.token_id
              )}
              class="btn btn-secondary">List NFT</button
            >
          </div>
        </div>
      </div>
    {/each}
  </div>
</ProtectedRoute>
