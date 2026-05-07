/// <reference types="astro/client" />

declare module 'virtual:starlight/components/LanguageSelect' {
	const Component: any;
	export default Component;
}

declare module 'virtual:starlight/components/Search' {
	const Component: any;
	export default Component;
}

declare module 'virtual:starlight/components/SiteTitle' {
	const Component: any;
	export default Component;
}

declare module 'virtual:starlight/components/SocialIcons' {
	const Component: any;
	export default Component;
}

declare module 'virtual:starlight/components/ThemeSelect' {
	const Component: any;
	export default Component;
}

declare const StarlightThemeProvider: {
	updatePickers(theme?: 'auto' | 'dark' | 'light'): void;
};
