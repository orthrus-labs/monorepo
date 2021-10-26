<script>
import {
    Web3
} from 'svelte-web3'
import MarketplaceContract from '../../../artifacts/contracts/Marketplace.sol/Marketplace.json'

async function getGreetings() {
    if (Web3) {
        // @ts-ignore
        const web3 = new Web3(window.ethereum)
        console.log("web3")
        const networkId = await web3.eth.net.getId()
        console.log("networkId:", networkId)
        const contract = new web3.eth.Contract(
            MarketplaceContract.abi,
            "0x26d945Af40c92878f64093e7744b4F51eA401DfF"
        );
        const response = await contract.methods.greet().call()
        console.log("response:", response)
        return response
    }
}
$: promise = getGreetings();
</script>

{#await promise}
<h1> loading... </h1>
{:then greetings}
<h1> yo {greetings}} </h1>

{/await}
