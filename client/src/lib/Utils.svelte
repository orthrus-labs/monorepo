<script context="module">
    import { Web3 } from "svelte-web3";
  import MarketplaceContract from "../../../artifacts/contracts/Marketplace.sol/Marketplace.json";
  import contractConfig from "../../contract.config.js";

 export async function getEmojis(marketItemId) {
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
</script>