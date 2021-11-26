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
  import contractConfig from "../../contract.config.js";
  import { onMount } from "svelte";

  let nfts = [];

  async function getItemIds() {
    if (Web3) {
      // @ts-ignore
      const web3 = new Web3(window.ethereum);
      console.log("web3");
      const networkId = await web3.eth.net.getId();
      console.log("networkId:", networkId);
      const contract = new web3.eth.Contract(
        MarketplaceContract.abi,
        contractConfig.marketplace.mumbai.contractAddress
      );
      const accounts = await web3.eth.getAccounts();
      console.log("accounts:", accounts);
    }
  }

  $: promise = getItemIds();

  onMount(async () => {
    nfts = await getListedNFTs();
  });

  async function getListedNFTs() {
    if (Web3) {
      // @ts-ignore
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const contract = new web3.eth.Contract(
        MarketplaceContract.abi,
        contractConfig.marketplace.mumbai.contractAddress
      );
      const accounts = await web3.eth.getAccounts();
      const receipt = await contract.methods.getUnsoldNFTsOnMarket().call({
        from: accounts[0],
      });
      console.log("receipt:", receipt);
      return receipt;
    }
  }

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

<div class="grid grid-cols-3 mx-auto px-4 md:max-w-10xl">
  {#await promise}
    <h1>loading...</h1>
  {:then items}
    <NFTItem
      title={"The Mike Tyson NFT Collection"}
      tokenId={10}
      price={100000000000000000000}
      img={tyson1}
      seller={"0x810DD92Ad0c199a7B364Fb324E97dac5e5014C5D"}
      timestamp={1637882532}
    />
    <NFTItem
      title={"The Mike Tyson NFT Collection"}
      tokenId={11}
      price={100000000000000000000}
      img={tyson2}
      seller={"0x810DD92Ad0c199a7B364Fb324E97dac5e5014C5D"}
      timestamp={1637882532}
    />
    <NFTItem
      title={"The Mike Tyson NFT Collection"}
      tokenId={12}
      price={100000000000000000000}
      img={tyson3}
      seller={"0x810DD92Ad0c199a7B364Fb324E97dac5e5014C5D"}
      timestamp={1637882532}
    />
    <NFTItem
      title={"Highland"}
      tokenId={7}
      price={100000000000000000000}
      img={highland1}
      seller={"0x810DD92Ad0c199a7B364Fb324E97dac5e5014C5D"}
      timestamp={1637882532}
    />
    <NFTItem
      title={"Edifice"}
      tokenId={7}
      price={100000000000000000000}
      img={edifice1}
      seller={"0x810DD92Ad0c199a7B364Fb324E97dac5e5014C5D"}
      timestamp={1637882532}
    />
    <NFTItem
      title={"Cryptopunks"}
      tokenId={5032}
      price={100000000000000000000}
      img={cryptopunk1}
      seller={"0x810DD92Ad0c199a7B364Fb324E97dac5e5014C5D"}
      timestamp={1637882532}
    />
    <NFTItem
      title={"The Mike Tyson NFT Collection"}
      tokenId={34}
      price={100000000000000000000}
      img={tyson3}
      seller={"0x810DD92Ad0c199a7B364Fb324E97dac5e5014C5D"}
      timestamp={1637882532}
    />
    <NFTItem
      title={"Highland"}
      tokenId={17}
      price={100000000000000000000}
      img={highland1}
      seller={"0x810DD92Ad0c199a7B364Fb324E97dac5e5014C5D"}
      timestamp={1637882532}
    />
  {/await}
  {#each nfts as item (item)}
    {#await getImage(item[3])}
      <h1>loading...</h1>
    {:then img}
      <NFTItem
        title={"Title"}
        price={item[6]}
        {img}
        marketItemId={item[0]}
        tokenId={item[2]}
        seller={item[4]}
        timestamp={item[7]}
      />
    {/await}
  {/each}
</div>
