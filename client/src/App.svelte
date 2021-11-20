<script>
  // @ts-nocheck

  import { Router } from "svelte-routing";
  import { Web3 } from "svelte-web3";
  import Navbar from "./lib/Navbar.svelte";
  import Footer from "./lib/Footer.svelte";

  // connect to Moralis server
  Moralis.initialize(import.meta.env.VITE_MORALIS_APP_ID);
  Moralis.serverURL = import.meta.env.VITE_MORALIS_SERVER_URI;

  async function connectWallet() {
    if (window.ethereum) {
      if (Web3) {
        window.web3 = new Web3(ethereum);
        const address = await window.ethereum.enable();
        metamaskConnected = window.ethereum.isConnected();
        return address[0];
      } else {
        console.log("Web3 is not defined");
      }
    }
  }

  function onClickConnectWallet() {
    promise = connectWallet();
  }
  $: promise = connectWallet();
  $: metamaskConnected = window.ethereum
    ? window.ethereum.isConnected()
    : false;
</script>

<Router>
  <div class="p-4 lg:p-10">
    {#if window.ethereum && !metamaskConnected}
      <p>Please connect to Metamask</p>
      <button on:click={onClickConnectWallet}> Connect wallet</button>
    {/if}
    <Navbar />
    <Footer />
  </div>
</Router>
