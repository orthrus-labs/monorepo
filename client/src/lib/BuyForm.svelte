<script>
  import { Web3 } from "svelte-web3";
  import MarketplaceContract from "../../../artifacts/contracts/Marketplace.sol/Marketplace.json";
  import contractConfig from "../../contract.config.js";
  import Spinner from "svelte-spinner";

  export let marketItemId;
  export let price;

  let isSubmitting = false;
  let isBought

  async function buyNFT(_marketItemId, _price) {
    console.log(_marketItemId)
    console.log(_price)
    if (Web3) {
      // @ts-ignore
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const contract = new web3.eth.Contract(
        MarketplaceContract.abi,
        contractConfig.marketplace.mumbai.contractAddress
      );
      const accounts = await web3.eth.getAccounts();
      const amountToSend = _price;
      const receipt = await contract.methods
        .buyNFT(
          marketItemId,
        )
        .send({
          from: accounts[0],
          value: amountToSend
        });
      console.log(receipt);
    }
  }

  async function handleSubmit() {
    isSubmitting = true;
    isBought = false;
    try {
      await buyNFT(marketItemId, price);
      isBought = true;
    } catch (e) {
      console.log("error in buying:", e);
    }
    isSubmitting = false;
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
    <div class="justify-end card-actions">
      {#if isBought}
      <div class="justify-center text-center mb-lg text-3xl">
        Buy Successfull 🤑
    </div>
      {:else if isSubmitting}
        <Spinner size="60" />
      {:else}
        <button class="btn btn-secondary" disabled={isSubmitting}
          >Buy NFT</button
        >
      {/if}
    </div>
</form>
