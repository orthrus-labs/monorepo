<script>
  // @ts-nocheck

  import { Route } from "svelte-routing";
  import Home from "../routes/Home.svelte";
  import About from "../routes/About.svelte";
  import List1 from "../routes/List.svelte";

  async function login() {
    let user = Moralis.User.current();
    if (!user) {
      user = await Moralis.authenticate();
      window.location.href = "/";
    }
  }
  async function logOut() {
    await Moralis.User.logOut();
    window.location.href = "/";
  }
</script>

<div
  class="sticky top-0 z-50 navbar col-span-1 shadow-lg md:col-span-2 xl:col-span-3 bg-neutral-focus text-neutral-content rounded-box mb-lg mx-md"
>
<div class="px-2 mx-2 navbar-start">
    <button class="btn btn-square btn-ghost">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        class="inline-block w-6 h-6 stroke-current"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
    <div class="flex-none px-2 mx-2">
        <span class="text-lg font-bold"> dExhibition </span>
      </div>
  </div>


  <div class="hidden px-2 mx-2 navbar-center lg:flex">
    <div class="items-stretch hidden lg:flex">
      <a href="/" class="btn btn-ghost btn-sm rounded-btn"> Bond </a>
      <a href="/List" class="btn btn-ghost btn-sm rounded-btn"> List </a>
    </div>
  </div>

  <div class="navbar-end m-2">
    {#if Moralis.User.current()}
      <div class="badge badge-primary m-2">
        {Moralis.User.current().attributes.accounts[0]}
      </div>
      <a on:click={logOut} class="m-2 btn btn-ghost btn-sm rounded-btn"> LogOut </a>
      <div class="flex-none">
        <div class="avatar">
          <div class="rounded-full w-14 h-14 m-1">
            <img
              src="https://publish.one37pm.net/wp-content/uploads/2021/02/punks.png?fit=600%2C600"
            />
          </div>
        </div>
      </div>
    {:else}
      <a on:click={login} class="btn btn-ghost btn-sm rounded-btn"> Login </a>
    {/if}
  </div>

</div>

<div>
  <Route path="/List" component={List1} />
  <Route path="/" component={Home} />
</div>
