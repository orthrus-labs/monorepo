<script>
  import { Web3 } from "svelte-web3";
  import MarketplaceContract from "../../../artifacts/contracts/Marketplace.sol/Marketplace.json";
  import NFTItem from "../lib/NFTItem.svelte";
  import tyson1 from "../images/tyson1.png";
  import cryptopunk1 from "../images/cryptopunk1.png";
  import edifice1 from "../images/edifice1.png";
  import tyson2 from "../images/tyson2.png";
  import tyson3 from "../images/tyson3.png";
  import highland1 from "../images/highland1.jpg";

  async function getItemIds() {
    if (Web3) {
      // @ts-ignore
      const web3 = new Web3(window.ethereum);
      console.log("web3");
      const networkId = await web3.eth.net.getId();
      console.log("networkId:", networkId);
      const contract = new web3.eth.Contract(
        MarketplaceContract.abi,
        "0xef1e49862C584AD68EADbB7e66368Aa5fde79062"
      );
      const accounts = await web3.eth.getAccounts();
      console.log("accounts:", accounts);
      //return await contract.methods.itemIds().call()
    }
  }

  $: promise = getItemIds();
</script>

{#await promise}
  <h1>loading...</h1>
{:then items}
  <div class="grid grid-cols-3 mx-auto px-4 md:max-w-10xl">
    <NFTItem title={"The Mike Tyson NFT Collection"} price={1} img={tyson1} />
    <NFTItem title={"The Mike Tyson NFT Collection"} img={tyson2} />
    <NFTItem title={"The Mike Tyson NFT Collection"} img={tyson3} />
    <NFTItem title={"Highland"} img={highland1} />
    <NFTItem title={"Edifice"} img={edifice1} />
    <NFTItem title={"Cryptopunks"} img={cryptopunk1} />
    <NFTItem title={"The Mike Tyson NFT Collection"} img={tyson3} />
    <NFTItem title={"Highland"} img={highland1} />
  </div>
{/await}
