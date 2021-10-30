<script>
import {
    Route
} from "svelte-routing";
import Home from "../routes/Home.svelte";
import About from "../routes/About.svelte";
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
            <a href="/list" class="btn btn-ghost btn-sm rounded-btn">
                List
            </a>
            <a href="/About" class="btn btn-ghost btn-sm rounded-btn">
                About
            </a>
        </div>
    </div>
    <div class="flex-none">
        <button class="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9">
                </path> 
            </svg>
        </button>
    </div>
    <div class="flex-none">
        <button class="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z">
                </path>
              </svg>
        </button>
    </div>
</div>
<div>
  <Route path="About" component="{About}" />
  <Route path="/" component="{Home}" />
</div>
