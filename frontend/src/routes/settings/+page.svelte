<!-----------------------------------------------------------------------------
 Codam Coding College, Amsterdam @ 2022.
 See README in the root project for more information.
------------------------------------------------------------------------------>

<!-- Scripting -->

<script lang="ts">
import Button from "$lib/Components/Button/Button.svelte";
import Container from "$lib/Components/Container/Container.svelte";






</script>

<!-- Styles -->

<style lang="scss">
	h1 {
		border-bottom: 1px solid;
		padding-bottom: 1rem;
		margin-bottom: 1rem;
		text-align: center;
	}

	.page {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	fieldset {
		border-radius: 8px;
		padding: 8px; 
		border: 2px solid;
		border-color: var(--component-border-color); 
	}
</style>

<!-- HTML -->

<svelte:head>
	<title>Settings</title>
	<meta name="description" content="Change your user settings" />
</svelte:head>

<div class="page">
	<Container flexGrow={1}>
		<form method="POST">
			<fieldset>
				<legend>User Data</legend>
				<div>
					<label>Username:</label>
					<input type="text" />
				</div>

				<div>
					<label htmlFor="gender">Gender:</label>
					<select>
						<option>Male</option>
						<option>Female</option>
					</select>
				</div>

				<Button type="submit">Save</Button>
			</fieldset>
		</form>

		<form method="POST">
			<fieldset>
				<legend>Authentication</legend>

				<div>
					<label htmlFor="token">Please enter the code you were sent:</label>
					<input
						type="text"
						name="token"
						id="token"
						inputMode="numeric"
						pattern="[0-9]*"
						autoComplete="one-time-code"
					/>
				</div>

				<Button type="submit">Submit</Button>
			</fieldset>
		</form>
	</Container>
</div>
