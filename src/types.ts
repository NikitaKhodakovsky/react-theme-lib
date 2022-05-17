export type Theme = 'light' | 'dark'
export type Subscriber = (t: Theme) => any
export type UnsubscribeFunction = () => void

export interface ThemeManagerOptions {
	previousUserTheme?: Theme
	superiorTheme?: Theme
	defaultTheme?: Theme
	keepInLocalStorage?: boolean
	localStorageKey?: string
	htmlElement?: HTMLElement
	onChange?: Subscriber
	onUserSetTheme?: Subscriber
	disablePrefersColorScheme?: boolean
	customLightClass?: string
	customDarkClass?: string
}

export interface UseThemeResult {
	theme: Theme
	isDark: boolean
	isLight: boolean
	setTheme: (theme: Theme) => void
	toggleTheme: () => void
}
