<script>
  import { Web3 } from "svelte-web3";
  import MarketplaceContract from "../../../artifacts/contracts/Marketplace.sol/Marketplace.json";
  import contractConfig from "../../contract.config.js";
  import Spinner from "svelte-spinner";

  export let tokenId;
  export let name;
  export let contractAddress;
  export let tokenUri;

  let price;
  let isSubmitting = false;
  let isListed;

  async function listNFT(_contractAddress, _tokenId, _price, _metadata) {
    if (Web3) {
      // @ts-ignore
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(
        MarketplaceContract.abi,
        contractConfig.marketplace.mumbai.contractAddress
      );
      const accounts = await web3.eth.getAccounts();
      const receipt = await contract.methods
        .listNFT(
          _contractAddress,
          _tokenId,
          _metadata,
          web3.utils.toWei(_price, "ether")
        )
        .send({
          from: accounts[0],
        });
      console.log(receipt);
    }
  }

  async function handleSubmit() {
    isSubmitting = true;
    isListed = false;
    try {
      await listNFT(contractAddress, tokenId, price, tokenUri);
      isListed = true;
    } catch (e) {
      console.log("Error in listing NFT:", e);
    }
    isSubmitting = false;
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <div class="card-body">
    <h2 class="card-title">
      {name}
      <div class="badge mx-2 badge-secondary">
        {tokenId}
      </div>
    </h2>
    <div class="justify-start card-actions">
      <div class="form-control">
        <label class="label">
          <span class="label-text">Price</span>
        </label>
        <label class="input-group input-group-md">
          <input
            class="input input-bordered input-md"
            type="text"
            placeholder="0.01"
            bind:value={price}
          />
          <span>MATIC</span>
        </label>
      </div>
    </div>
    <div class="justify-end card-actions">
      {#if isListed}
        <div class="justify-center text-center mb-lg text-3xl">Listed 🤑</div>
      {:else if isSubmitting}
        <Spinner size="60" />
      {:else}
        <button class="btn btn-secondary" disabled={isSubmitting}>
          List NFT
        </button>
      {/if}
    </div>
  </div>
</form>
