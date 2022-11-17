<!-----------------------------------------------------------------------------
 Codam Coding College, Amsterdam @ 2022.
 See README in the root project for more information.
------------------------------------------------------------------------------>

<!-- Scripting -->

<script lang="ts">
import Container from "../Container/Container.svelte";

/** Toggle the modal visiblity */
export let visible: boolean = false;
</script>

<!-- HTML -->

{#if visible}
    <div class="modal">
        <div class="content">
            <Container style="flex: 0;">
                <slot/>
            </Container>
        </div>
    </div>
{/if}


<!-- Styling -->

<style lang="scss">
.modal {
    display: flex;
    justify-content: center;
    align-items: center;

    position: fixed;
    left: 0;
    top: 0;
    
    z-index: 999;
    

    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0 ,0, 0, 0.4);
}

.content {
    position: relative;
    width: 50%;
    bottom: 25vh;
}
</style>
