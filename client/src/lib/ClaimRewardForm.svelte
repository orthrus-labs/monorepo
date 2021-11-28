<script>
  import { Web3 } from "svelte-web3";
  import MarketplaceContract from "../../../artifacts/contracts/Marketplace.sol/Marketplace.json";
  import contractConfig from "../../contract.config.js";
  import Spinner from "svelte-spinner";

  export let marketItemId

  let isSubmitting = false;
  let isClaimed;

  async function claimReward(_marketItemId) {
      console.log("claim reward:", _marketItemId)
    if (Web3) {
      // @ts-ignore
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const contract = new web3.eth.Contract(
        MarketplaceContract.abi,
        contractConfig.marketplace.mumbai.contractAddress
      );
      const accounts = await web3.eth.getAccounts();
      const receipt = await contract.methods
        .claimReward(_marketItemId)
        .send({
          from: accounts[0],
      });
    }
  }

  async function handleSubmit() {
    isSubmitting = true;
    isClaimed = false;
    try {
      await claimReward(marketItemId);
      isClaimed = true;
    } catch (e) {
      console.log("error in claiming reward:", e);
    }
    isSubmitting = false;
  }
</script>

{#if marketItemId}
<form on:submit|preventDefault={handleSubmit}>
  <div class="justify-end card-actions">
    {#if isClaimed}
      <div class="justify-center text-center mb-lg text-3xl">
        Claimed Successfully 🤑
      </div>
    {:else if isSubmitting}
      <Spinner size="60" />
    {:else}
      <button disabled={isSubmitting} class="btn btn-lg mt-xl">
        Claim (Reward + Bonded value)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="inline-block w-6 h-6 ml-2 stroke-current"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    {/if}
  </div>
</form>
{/if}
