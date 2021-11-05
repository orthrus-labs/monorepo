<script>
import {
    Web3
} from 'svelte-web3'
import MarketplaceContract from '../../../artifacts/contracts/Marketplace.sol/Marketplace.json'
import NFTItem from '../lib/NFTItem.svelte'
import tyson1 from '../images/tyson1.png'
import tyson2 from '../images/tyson2.png'
import tyson3 from '../images/tyson3.png'
import highland1 from '../images/highland1.jpg'

async function getItemIds() {
    if (Web3) {
        // @ts-ignore
        const web3 = new Web3(window.ethereum)
        console.log("web3")
        const networkId = await web3.eth.net.getId()
        console.log("networkId:", networkId)
        const contract = new web3.eth.Contract(
            MarketplaceContract.abi,
            "0x69F317DB35CbEf869701373437371beaE3aF2039"
        );
        const accounts = await web3.eth.getAccounts()
        console.log('accounts:',accounts)
        //return await contract.methods.itemIds().call()
    }
}

$: promise = getItemIds()
</script>

{#await promise}
<h1> loading... </h1>
{:then items}
<div class="grid grid-cols-4">
    <NFTItem img={tyson1} />
    <NFTItem img={tyson2}/>
        <NFTItem img={tyson3}/>
            <NFTItem img={highland1}/>
                <NFTItem img={tyson1}/>
                    <NFTItem img={tyson2}/>
                        <NFTItem img={tyson3}/>
                            <NFTItem img={highland1}/>
                                </div>
                                {/await}
