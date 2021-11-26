<script>
  import { Web3 } from "svelte-web3";
  import MarketplaceContract from "../../../artifacts/contracts/Marketplace.sol/Marketplace.json";
  import contractConfig from "../../contract.config.js";
  import Spinner from "svelte-spinner";

  export let marketItemId;
  let iconId = 0;
  let amount;

  let isSubmitting = false;
  let isBonded;

  function onChange(event) {
    iconId = event.currentTarget.value;
  }

  async function bondNFT(_marketItemId, _amount, _iconId) {
    console.log("marketitem id:", _marketItemId);
    console.log("amount:", _amount);
    console.log("icon:", _iconId);
    if (Web3) {
      // @ts-ignore
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const contract = new web3.eth.Contract(
        MarketplaceContract.abi,
        contractConfig.marketplace.mumbai.contractAddress
      );
      const accounts = await web3.eth.getAccounts();
      const erc20address = contractConfig.erc20address.mumbai.contractAddress;
      console.log("erc20 address:", erc20address);
      const receipt = await contract.methods
        .bondNFT(_marketItemId, _amount, erc20address, _iconId)
        .send({
          from: accounts[0],
        });
      console.log("bond receipt:", receipt);
    }
  }

  async function handleSubmit() {
    isSubmitting = true;
    isBonded = false;
    try {
      await bondNFT(marketItemId, amount, iconId);
      isBonded = true;
    } catch (e) {
      console.log("error in bonding:", e);
    }
    isSubmitting = false;
  }
</script>

<div class="justify-end card-actions">
  {#if marketItemId}
    <form on:submit|preventDefault={handleSubmit}>
      {#if isBonded}
        <div class="justify-center text-center mb-lg text-3xl">
          Bond Successfull 🤑
        </div>
      {:else if isSubmitting}
        <Spinner size="60" />
      {:else}
        <label for={marketItemId} class="btn btn-primary modal-button"
          >React</label
        >
        <input type="checkbox" id={marketItemId} class="modal-toggle" />
        <div class="modal">
          <div class="modal-box">
            <div class="form-control m-2">
              <label class="label">
                <span class=" text-4xl label-text mb-2">Value in $DAI</span>
              </label>
              <label class="mb-10 input-group input-group-md">
                <input
                  type="text"
                  bind:value={amount}
                  class="text-3xl w-full input input-accent input-bordered input-md"
                />
              </label>
              <label class="label">
                <span class=" text-4xl label-text">Emoji</span>
              </label>
            </div>
            <div class="m-2 p-6 card bordered">
              <div class="form-control">
                <label class="cursor-pointer label">
                  <span class="text-4xl label-text">😍</span>
                  <input
                    type="radio"
                    name={iconId}
                    on:change={onChange}
                    checked={iconId === 0}
                    class="radio"
                    value="0"
                  />
                </label>
              </div>
              <div class="form-control">
                <label class="cursor-pointer label">
                  <span class="text-4xl label-text">🤣</span>
                  <input
                    type="radio"
                    name={iconId}
                    on:change={onChange}
                    checked={iconId === 1}
                    class="radio"
                    value="1"
                  />
                </label>
              </div>
              <div class="form-control">
                <label class="cursor-pointer label">
                  <span class="text-4xl label-text">🤬</span>
                  <input
                    type="radio"
                    name={iconId}
                    on:change={onChange}
                    checked={iconId === 2}
                    class="radio"
                    value="2"
                  />
                </label>
              </div>
              <div class="form-control">
                <label class="cursor-pointer label">
                  <span class="text-4xl label-text">🤮</span>
                  <input
                    type="radio"
                    name={iconId}
                    on:change={onChange}
                    checked={iconId === 3}
                    class="radio"
                    value="3"
                  />
                </label>
              </div>
            </div>
            <div class="modal-action">
              {#if isSubmitting}
                <Spinner size="60" />
              {:else}
                <button class="btn btn-secondary" disabled={isSubmitting}
                  >Bond</button
                >
                <label for={marketItemId} class="btn">Cancel</label>
              {/if}
            </div>
          </div>
        </div>
      {/if}
    </form>
  {:else}
    <label class="btn btn-primary modal-button">React</label>
  {/if}
</div>
