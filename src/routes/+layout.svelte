<script lang="ts">
	// path: ~/Develop/aliceinhelloworld/src/routes/+layout.svelte
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import { css } from 'styled-system/css';

	let { children } = $props();
</script>

<svelte:head>
	<title></title>
	<link rel="icon" href={favicon} />
</svelte:head>
<div class={css({})}>
	<div class={css({})}>
		<Header />
	</div>
	<div class={css({})}>
		{@render children()}
	</div>
</div>
