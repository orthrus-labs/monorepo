<script>
  export let img;
  export let price;
  export let title;
  export let marketItemId;

  import { Web3 } from "svelte-web3";
  import MarketplaceContract from "../../../artifacts/contracts/Marketplace.sol/Marketplace.json";
  import tyson3 from "../images/tyson3.png";
  import contractConfig from "../../contract.config.js";
  import { onMount } from "svelte";

  let emojis = [];

  async function getEmojis(_marketItemId) {
    // @ts-ignore
    const web3 = new Web3(window.ethereum);
    const networkId = await web3.eth.net.getId();
    const contract = new web3.eth.Contract(
      MarketplaceContract.abi,
      contractConfig.marketplace.mumbai.contractAddress
    );
    const accounts = await web3.eth.getAccounts();
    console.log("market id:", _marketItemId);
    const receipt = await contract.methods.getNFTBond(_marketItemId).call({
      from: accounts[0],
    });
    console.log("emojis:", receipt);
    return receipt;
  }

  onMount(async () => {
    try {
      emojis = await getEmojis(marketItemId);
    } catch (e) {
      console.log("error in getting emojis:", e);
    }
    console.log("after moint");
  });

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
</script>

<div class="p-2 m-3 border-2 h-20px">
  <div class="h-20px w-full">
    {#if img}
      <img class="bg-gray-100 h-xl object-contain w-full" src={img} />
    {:else}
      <img class="bg-gray-100 h-xl object-contain w-full" src={tyson3} />
    {/if}
  </div>
  <div class="card-body">
    {#if emojis.length == 0}
      <div class="justify-center text-center mb-lg text-3xl">
        {getRandomInt(10)} 😍 {getRandomInt(6)} 🤣 {getRandomInt(4)} 🤬 {getRandomInt(
          2
        )} 🤮
      </div>
    {:else}
      {#each emojis as emoji (emoji)}
        <!-- TODO display correct amount of emojis -->
        <div class="justify-center text-center mb-lg text-3xl">
          1 😍 1 🤣 4 🤬 5 🤮
        </div>
      {/each}
    {/if}

    <h2 class="card-title">{title}</h2>
    <div class="justify-start card-actions">
                <!-- TODO display token id-->

      <p>ID: #3 😀</p>
                      <!-- TODO display token contract, seller, timestamp, voting power-->

    </div>
    <div class="justify-start card-actions">
      {#if price}
        <p>{price / Math.pow(10, 18)} MATIC</p>
      {:else}
        <p>1 ETH</p>
      {/if}
    </div>
    <div class="justify-start card-actions">
      <p>Listed 3 days ago</p>
    </div>
    <div class="card-actions justify-end">
      <div>
        <button class="btn btn-secondary">Buy</button>
        <label for="my-modal-2" class="btn btn-primary modal-button"
          >React</label
        >
        <input type="checkbox" id="my-modal-2" class="modal-toggle" />
        <div class="modal">
          <div class="modal-box">
            <div class="form-control m-2">
              <label class="label">
                <span class=" text-4xl label-text mb-2">Value in $DAI</span>
              </label>
              <label class="mb-10 input-group input-group-md">
                <input
                  type="text"
                  value="100.00$"
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
                    name="opt"
                    checked="checked"
                    class="radio"
                    value=""
                  />
                </label>
              </div>
              <div class="form-control">
                <label class="cursor-pointer label">
                  <span class="text-4xl label-text">🤣</span>
                  <input
                    type="radio"
                    name="opt"
                    checked="checked"
                    class="radio"
                    value=""
                  />
                </label>
              </div>
              <div class="form-control">
                <label class="cursor-pointer label">
                  <span class="text-4xl label-text">🤬</span>
                  <input
                    type="radio"
                    name="opt"
                    checked="checked"
                    class="radio"
                    value=""
                  />
                </label>
              </div>
              <div class="form-control">
                <label class="cursor-pointer label">
                  <span class="text-4xl label-text">🤮</span>
                  <input
                    type="radio"
                    name="opt"
                    checked="checked"
                    class="radio"
                    value=""
                  />
                </label>
              </div>
            </div>
            <div class="modal-action">
              <label for="my-modal-2" class="btn btn-primary">Bond</label>
              <label for="my-modal-2" class="btn">Cancel</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
