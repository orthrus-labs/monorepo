<script>
  import { onMount } from "svelte";
  import ProtectedRoute from "../lib/ProtectedRoute.svelte";
  import tyson2 from "../images/tyson2.png";
  import ListNFTForm from "../lib/ListNFTForm.svelte";

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
</script>

<ProtectedRoute>
  <div class="grid grid-cols-3 mx-auto px-4 md:max-w-10xl">
    {#each nfts as item (item)}
      <div class="p-2 m-3 border-2 h-20px">
        {#await getImage(item.attributes.token_uri)}
          <h1>loading...</h1>
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
        <ListNFTForm
          name={item.attributes.name}
          tokenId={item.attributes.token_id}
          contractAddress={item.attributes.token_address}
          tokenUri={item.attributes.token_uri}
        />
      </div>
    {/each}
  </div>
</ProtectedRoute>
