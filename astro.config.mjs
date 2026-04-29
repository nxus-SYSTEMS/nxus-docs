// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightVersions from 'starlight-versions';

const site = process.env.SITE_URL ?? 'https://docs.nxus.systems';
const base = process.env.BASE_PATH;

// https://astro.build/config
export default defineConfig({
	site,
	...(base ? { base } : {}),
	integrations: [
		starlight({
			title: 'nxus.SYSTEMS Docs',
			description: 'Documentation for nxus.SYSTEMS products and services.',
			logo: {
				light: './src/assets/logo-light.svg',
				dark: './src/assets/logo-dark.svg',
				alt: 'nxus.SYSTEMS Docs',
				replacesTitle: true,
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/nxus-SYSTEMS' },
			],
			plugins: [
				starlightVersions({
					versions: [
						// Archived versions in reverse chronological order.
						// First entry = most recently archived version.
						{ slug: 'v0.9.2', label: 'v0.9.2' },
					],
					current: { label: 'v0.9.3 (latest)' },
				}),
			],
			sidebar: [
				{
					label: 'GitHub Repositories',
					link: '/github/',
				},
				// Product sections are top-level groups. A custom switcher can
				// replace this once multiple product docs are live.
				{
					label: 'nxusKit SDK',
					collapsed: false,
					// Content under nxuskit/ is generated in source repos and
					// synced locally or by a self-hosted runner.
					autogenerate: { directory: 'nxuskit' },
				},
			],
			customCss: ['./src/styles/custom.css'],
			components: {
				Head: './src/components/Head.astro',
				Header: './src/components/Header.astro',
				MobileMenuFooter: './src/components/MobileMenuFooter.astro',
				ThemeProvider: './src/components/ThemeProvider.astro',
				ThemeSelect: './src/components/ThemeSelect.astro',
			},
		}),
	],
});
