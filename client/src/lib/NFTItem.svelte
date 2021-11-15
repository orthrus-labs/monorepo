<script>
export let img;
</script>

<div class="card bordered object-scale-down h-auto p-10">
    <figure>
        <img src={img} />
    </figure>
    <div class="card-body">
        <h2 class="card-title">
            Top image
            <div class="badge mx-2 badge-secondary">NEW</div>
        </h2>
        <p>Rerum reiciendis beatae tenetur excepturi aut pariatur est eos.</p>
        <div class="justify-end card-actions">
            <button class="btn btn-secondary">React</button>
        </div>
        <div class="stat">
            <div class="stat-figure text-info">
                <div class="avatar online">
                    <div class="w-16 h-16 p-1 mask mask-squircle bg-base-100">
                        <img
                            src="/tailwind-css-component-profile-5@56w.png"
                            alt="Avatar Tailwind CSS Component"
                            class="mask mask-squircle"
                            />
                    </div>
                </div>
            </div>
            <div class="stat-value">86%</div>
            <div class="stat-title">Tasks done</div>
            <div class="stat-desc text-info">31 tasks remaining</div>
        </div>
    </div>
</div>
