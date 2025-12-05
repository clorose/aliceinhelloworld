<script lang="ts">
	import { css } from 'styled-system/css';
</script>

<svelte:head>
	<title>AliceOS</title>
</svelte:head>

<div
	class={css({
		w: '100%',
		h: '100vh',
		fontWeight: 'bold',
		bg: 'red.400',
		color: 'white',
		p: 16,
		borderRadius: 'xl'
	})}
>
	<h1 class={css({ fontSize: '36px' })}>Welcome to Panda + SvelteKit</h1>

	<p>
		Visit
		<a href="https://svelte.dev/docs/kit" target="_blank">svelte.dev/docs/kit</a>
		to read the documentation
	</p>
</div>
