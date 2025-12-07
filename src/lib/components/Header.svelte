<script lang="ts">
	import { css } from 'styled-system/css';
</script>

<header
	class={css({
		height: '32px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		px: '4',
		borderBottom: '1px solid',
		borderColor: 'gray.200',
		fontSize: 'xs'
	})}
>
	<div>logo</div>
	<nav
		class={css({
			display: 'flex',
			alignItems: 'center',
			gap: '3'
		})}
	>
		<a href="/">홈</a>
		<a href="/login">로그인</a>
		<div>1:30</div>
	</nav>
</header>
