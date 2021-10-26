<script>
    import {
        Web3
    } from 'svelte-web3'
    import MarketplaceContract from '../../../artifacts/contracts/Marketplace.sol/Marketplace.json'
    import NFTItem from '../lib/NFTItem.svelte'
    
    async function getMarketplace() {
        if (Web3) {
            // @ts-ignore
            const web3 = new Web3(window.ethereum)
            console.log("web3")
            const networkId = await web3.eth.net.getId()
            console.log("networkId:", networkId)
            const contract = new web3.eth.Contract(
                MarketplaceContract.abi,
                ""
            );
            //const response = await contract.methods.greet().call()
            //console.log("response:", response)
            return ""
        }
    }
    $: promise = getMarketplace();
    </script>
    
    {#await promise}
    <h1> loading... </h1>
    {:then marketplace}
    <h1> yo {marketplace}} </h1>
    <NFTItem/>
    {/await}
    