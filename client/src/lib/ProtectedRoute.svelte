<script>
import {
    onMount
} from 'svelte'

let isLoading = true;
onMount(async () => {
    let isAuthenticated = false
    let user = Moralis.User.current();
    console.log("current user:", user)
    if (!user) {
        console.log("You need to login")
        window.location.href = '/'
    }
    isAuthenticated = true
    isLoading = false;
})
</script>

{#if isLoading}
    <p>Loading</p>
{:else}
    <slot/>
{/if}
