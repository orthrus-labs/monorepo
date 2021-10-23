<script>
// @ts-nocheck

import {
    Router
} from "svelte-routing";
import {
    Web3
} from "svelte-web3";
async function connectWallet() {
    if (window.ethereum) {
        if (Web3) {
            window.web3 = new Web3(ethereum);
            await window.ethereum.enable()
            metamaskConnected = window.ethereum.isConnected()
        } else {
            console.log("Web3 is not defined")
        }
    }
}

function onClickConnectWallet() {
    promise = connectWallet();
}
$: promise = connectWallet();
$: metamaskConnected = window.ethereum ? window.ethereum.isConnected() : false;
</script>

<Router>
    {#if window.ethereum }
    <p>Brownser wallet already connected to metamask</p>
    {/if}
    {#if window.ethereum && !metamaskConnected }
    <p>Please connect to metamask</p>
    <button on:click={onClickConnectWallet}> Connect wallet</button>
    {/if}
</Router>
