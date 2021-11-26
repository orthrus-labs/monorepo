<script>
  export let img;
  export let price;
  export let title;
  export let marketItemId;
  export let tokenId;
  export let seller;
  export let timestamp;

  import { Web3 } from "svelte-web3";
  import MarketplaceContract from "../../../artifacts/contracts/Marketplace.sol/Marketplace.json";
  import tyson3 from "../images/tyson3.png";
  import contractConfig from "../../contract.config.js";
  import BuyForm from "../lib/BuyForm.svelte";
  import BondForm from "../lib/BondForm.svelte";

  async function getEmojis() {
    let emojis = [0, 0, 0, 0];
    const web3 = new Web3(window.ethereum);
    const networkId = await web3.eth.net.getId();
    const contract = new web3.eth.Contract(
      MarketplaceContract.abi,
      contractConfig.marketplace.mumbai.contractAddress
    );
    const accounts = await web3.eth.getAccounts();
    if (marketItemId == undefined) {
      return emojis;
    }
    const res = await contract.methods.getNFTBond(marketItemId).call({
      from: accounts[0],
    });
    for (let i = 0; i < res.length; i++) {
      if (res[i].iconId) {
        emojis[res[i].iconId] = emojis[res[i].iconId] + 1;
      }
    }
    return emojis;
  }

  $: promise = getEmojis();

  function areNoEmojis(_emojis) {
    for (let i = 0; i < _emojis.length; i++) {
      if (_emojis[i] != 0) {
        return false;
      }
    }
    return true;
  }

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
    {#await promise}
      <h1>loading emojis..</h1>
    {:then emojis}
      {#if areNoEmojis(emojis)}
        <div class="justify-center text-center mb-lg text-3xl">
          {getRandomInt(10)} 😍 {getRandomInt(6)} 🤣 {getRandomInt(4)} 🤬 {getRandomInt(
            2
          )} 🤮
        </div>
      {:else}
        <div class="justify-center text-center mb-lg text-3xl">
          {emojis[0]} 😍 {emojis[1]} 🤣 {emojis[2]} 🤬 {emojis[3]} 🤮
        </div>
      {/if}
    {/await}

    <h2 class="card-title">{title}</h2>
    <div class="justify-start card-actions">
      <p>ID: {tokenId}</p>
      <p>Seller: {seller}</p>
      <p>Timestamp: {timestamp}</p>
      <!-- TODO display token contract, seller, timestamp, voting power-->
    </div>
    <div class="justify-start card-actions">
      {#if price}
        <p>Price: {price / Math.pow(10, 18)} MATIC</p>
      {:else}
        <p>1 ETH</p>
      {/if}
    </div>
    <div class="justify-start card-actions">
      <p>Listed 3 days ago</p>
    </div>
    <div class="card-actions justify-end">
      <div>
        <BuyForm {price} {marketItemId} />
        <BondForm {marketItemId} />
      </div>
    </div>
  </div>
</div>
