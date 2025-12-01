// path: ~/Develop/aliceinhelloworld/svelte.config.js
import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess(), mdsvex()],
	kit: {
		adapter: adapter(),
		alias: {
			// pandaCss
			'styled-system':'./styled-system/*'
		},typescript: {
			config: (config) => {
				config.include.push('../styled-system');
				return config;
			}
		}
	},
	extensions: ['.svelte', '.svx']
};

export default config;
