<script>
      import SampleTable from "../lib/SampleTable.svelte";
      import tyson2 from "../images/tyson2.png";
      export let image

      function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
</script>
<div class="card lg:card-side bordered">
    {#if image}
      <img
        alt={"nft claimable img"}
        style="height: 600px; width: 400px;"
        class="bg-gray-100 object-contain"
        src={image}
      />
    {:else}
      <img
        class="bg-gray-100 object-contain"
        style="height: 600px; width: 400px;"
        src={tyson2}
        alt={"NFT picture"}
      />
    {/if}
    <div class="card-body">
      <h2 class="my-4 text-4xl font-bold card-title">
        Mike Tyson NFT Collection
      </h2>
      <div class="mb-4 space-x-2 card-actions">
        <div class="badge badge-ghost">Claimable</div>
      </div>
      <div class="w-full shadow stats my-xl">
        <div class="stat">
          <div class="stat-title">Total Emojis</div>
          <div class="stat-value text-primary">
            3 😍 1 🤣 1 🤬 0 🤮
          </div>
        </div>
        <div class="stat">
          <div class="stat-title">Claimable Reward</div>
          <div class="stat-value text-info">10 Matic</div>
        </div>
        <div class="stat">
          <div class="stat-figure text-info">
            <div class="avatar online">
              <div class="w-20 h-20 rounded-full">
                <img
                  src="https://uploads-ssl.webflow.com/5ead65b4cd1146b85071bfdf/608ff2a12bc39c3ff457ae36_Bored%20Ape%208622-%20Image%202.png"
                />
              </div>
            </div>
          </div>
          <div class="stat-title">Buyer</div>
          <div class="stat-desc text-info">
            0x810DD92Ad0c199a7B364Fb324E97dac5e5014C5D
          </div>
          <div class="stat-desc text-info">Sold at 1000 MATIC</div>
        </div>
      </div>
      <div
        style="width: 100%;"
        class="collapse border rounded-box border-base-300 collapse-arrow"
      >
        <input type="checkbox" />
        <div class="collapse-title text-xl font-medium">
          Other Curators
        </div>
        <div class="collapse-content">
          <SampleTable />
        </div>
      </div>

      <div class="card-actions justify-end ">
        <button class="btn btn-lg mt-xl">
          Claim (Reward + Bonded value) 
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block w-6 h-6 ml-2 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>