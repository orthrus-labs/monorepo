<script>
export let img;
export let price;
export let title;
</script>

<div class="p-2 m-3 border-2 h-20px">
    <div class="h-20px w-full">
        <img class="bg-gray-100 h-xl object-contain w-full" src={img} />
    </div>
    <div class="card-body">
        <div class="justify-center text-center mb-lg text-3xl">
            1 😍 1 🤣 4 🤬 5 🤮
        </div>
        <h2 class="card-title">{title}</h2>
        <div class="justify-start card-actions">
            <p>ID: #3 😀</p>
        </div>
        <div class="justify-start card-actions">
            <p>1 ETH</p>
        </div>
        <div class="justify-start card-actions">
            <p>Listed 3 days ago</p>
        </div>
        <div class="card-actions justify-end">
            <div>
                <button class="btn btn-secondary">Buy</button>
                <label for="my-modal-2" class="btn btn-primary modal-button">React</label>
                <input type="checkbox" id="my-modal-2" class="modal-toggle">
                <div class="modal">
                    <div class="modal-box">
                        <div class="form-control m-2">
                            <label class="label">
                                <span class=" text-4xl label-text mb-2">Value in $DAI</span>
                            </label>
                            <label class="mb-10 input-group input-group-md">
                                <input type="text" value="100.00$" class="text-3xl w-full input input-accent input-bordered input-md">
                            </label>
                            <label class="label">
                                <span class=" text-4xl label-text">Emoji</span>
                            </label>
                        </div>
                        <div class="m-2 p-6 card bordered">
                            <div class="form-control">
                                <label class="cursor-pointer label">
                                    <span class="text-4xl label-text">😍</span>
                                    <input type="radio" name="opt" checked="checked" class="radio" value="">
                                </label>
                            </div>
                            <div class="form-control">
                                <label class="cursor-pointer label">
                                    <span class="text-4xl label-text">🤣</span>
                                    <input type="radio" name="opt" checked="checked" class="radio" value="">
                                </label>
                            </div>
                            <div class="form-control">
                                <label class="cursor-pointer label">
                                    <span class="text-4xl label-text">🤬</span>
                                    <input type="radio" name="opt" checked="checked" class="radio" value="">
                                </label>
                            </div>
                            <div class="form-control">
                                <label class="cursor-pointer label">
                                    <span class="text-4xl label-text">🤮</span>
                                    <input type="radio" name="opt" checked="checked" class="radio" value="">
                                </label>
                            </div>
                        </div>
                        <div class="modal-action">
                            <label for="my-modal-2" class="btn btn-primary">Bond</label>
                            <label for="my-modal-2" class="btn">Cancel</label>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>
