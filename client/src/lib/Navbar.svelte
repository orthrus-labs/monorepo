<script>
// @ts-nocheck

import {
    Route
} from "svelte-routing";
import Home from "../routes/Home.svelte";
import About from "../routes/About.svelte";
import List1 from "../routes/List.svelte";

async function login() {
    let user = Moralis.User.current();
    if (!user) {
        user = await Moralis.authenticate();
        window.location.href = '/'
    }
}
async function logOut() {
    await Moralis.User.logOut();
    window.location.href = '/'
}
</script>

<div class="navbar col-span-1 shadow-lg md:col-span-2 xl:col-span-3 bg-neutral-focus text-neutral-content rounded-box">
    <div class="flex-none">
        <button class="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
        </button>
    </div>
    <div class="flex-none px-2 mx-2">
        <span class="text-lg font-bold">
            DExhibition
        </span>
    </div>
    <div class="flex justify-center flex-1 px-2 mx-2">
        <div class="items-stretch hidden lg:flex">
            <a href="/" class="btn btn-ghost btn-sm rounded-btn">
                Home
            </a>
            <a href="/bond" class="btn btn-ghost btn-sm rounded-btn">
                Bond
            </a>
            <a href="/List" class="btn btn-ghost btn-sm rounded-btn">
                List
            </a>
            <a href="/About" class="btn btn-ghost btn-sm rounded-btn">
                About
            </a>
        </div>
    </div>
    { #if Moralis.User.current()}
    <a on:click={logOut} class="btn btn-ghost btn-sm rounded-btn">
        LogOut
    </a>
    <div class="flex-none">
        <div class="avatar">
            <div class="rounded-full w-10 h-10 m-1">
                <img src="https://i.pravatar.cc/500?img=32">
            </div>
        </div>
    </div>
    {:else}
    <a on:click={login} class="btn btn-ghost btn-sm rounded-btn">
        Login
    </a>
    {/if}
</div>
<div>
    <Route path="About" component="{About}" />
    <Route path="/List" component="{List1}" />
    <Route path="/" component="{Home}" />
</div>
