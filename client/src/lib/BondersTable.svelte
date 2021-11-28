<script>
  export let bonders;
</script>

<div class="overflow-x-auto">
  <table class="table w-full">
    <thead>
      <tr>
        <th>Curator</th>
        <th>Voting Power</th>
        <th>Reward</th>
        <th />
      </tr>
    </thead>
    <tbody>
      {#each bonders as bonder}
        <tr>
          <td>
            <div class="flex items-center space-x-3">
              <div class="avatar online">
                <div class="w-12 h-12 rounded-full">
                  <img
                    alt="bonder"
                    src="https://uploads-ssl.webflow.com/5ead65b4cd1146b85071bfdf/608ff2a12bc39c3ff457ae36_Bored%20Ape%208622-%20Image%202.png"
                  />
                </div>
              </div>
              <div>
                <div class="font-bold">{bonder.bonderAddress}</div>
                <div class="text-sm opacity-50">LVL 1</div>
              </div>
            </div>
          </td>
          <td>
            {bonder.votingPower}
            <br />
          </td>
          <td>
            {bonder.rewardClaimable}
            MATIC</td
          >
          <th>
            <button class="btn btn-ghost btn-xs">details</button>
          </th>
        </tr>
      {/each}
    </tbody>
    <tfoot>
      <tr>
        <th>Curator</th>
        <th>Voting Power</th>
        <th>Reward</th>
        <th />
      </tr>
    </tfoot>
  </table>
</div>
