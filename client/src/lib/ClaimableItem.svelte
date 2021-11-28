<script>
      import BondersTable from "../lib/BondersTable.svelte";
      import ClaimRewardForm from "../lib/ClaimRewardForm.svelte";
      import tyson2 from "../images/tyson2.png";
      export let item

      function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
</script>
<div class="card lg:card-side bordered">
    {#if item.image}
      <img
        alt={"nft claimable img"}
        style="height: 600px; width: 400px;"
        class="bg-gray-100 object-contain"
        src={item.image}
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
        Crazy Eyes
      </h2>
      <div class="mb-4 space-x-2 card-actions">
        <div class="badge badge-ghost">Claimable</div>
      </div>
      <div class="w-full shadow stats my-xl">
        <div class="stat">
          <div class="stat-title">Total Emojis</div>
          <div class="stat-value text-primary">
            {item.totalEmojis[0]} 😍 {item.totalEmojis[1]} 🤣 {item.totalEmojis[2]} 🤬 {item.totalEmojis[3]} 🤮
          </div>
        </div>
        <div class="stat">
          <div class="stat-title">Claimable Reward</div>
          <div class="stat-value text-info">{item.rewardClaimable.toFixed(3)} MATIC</div>
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
            {item.buyer}
          </div>
          <div class="stat-desc text-info">Sold at {item.soldPrice} MATIC</div>
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
          <BondersTable bonders={item.otherBonders} />
        </div>
      </div>

      <div class="card-actions justify-end ">
        <ClaimRewardForm marketItemId={item.marketItemId}/>
      </div>
    </div>
  </div>