/* ----- previousUserTheme > userThemeFromLS > superiorTheme > prefferedThemeMedia > defaultTheme ----- */

import { Subscriber, Theme, ThemeManagerOptions, UnsubscribeFunction } from './types'

export class ThemeManager {
	private subscribers: Subscriber[] = []
	private onUserSetTheme?: Subscriber

	//Theme explicitly setted by user (previous from local storage or setTheme)
	private userTheme?: Theme

	//superiorTheme > prefferedThemeMedia > defaultTheme
	private computedTheme: Theme

	private localStorageKey: string = 'theme'
	private keepInLocalStorage: boolean = true

	private htmlElement?: HTMLElement
	private lightClass: string = 'light'
	private darkClass: string = 'dark'

	private darkMedia = window.matchMedia('(prefers-color-scheme: dark)')
	private lightMedia = window.matchMedia('(prefers-color-scheme: light)')
	private disablePrefersColorScheme: boolean = false

	constructor({
		previousUserTheme,
		superiorTheme,
		defaultTheme,
		keepInLocalStorage,
		onChange,
		onUserSetTheme,
		localStorageKey,
		htmlElement,
		disablePrefersColorScheme,
		customDarkClass,
		customLightClass
	}: ThemeManagerOptions = {}) {
		/* --------------------------- Basic configuration -------------------------- */

		if (disablePrefersColorScheme === true) this.disablePrefersColorScheme = true
		if (keepInLocalStorage === false) this.keepInLocalStorage = false
		if (localStorageKey) this.localStorageKey = localStorageKey
		if (onUserSetTheme) this.onUserSetTheme = onUserSetTheme
		if (customLightClass) this.lightClass = customLightClass
		if (customDarkClass) this.darkClass = customDarkClass
		if (htmlElement) this.htmlElement = htmlElement
		if (onChange) this.subscribe(onChange)

		/* ------------------------ Define the computedTheme ------------------------ */

		let prefferedTheme: Theme | undefined

		if (!this.disablePrefersColorScheme) {
			if (this.darkMedia.matches) prefferedTheme = 'dark'
			if (this.lightMedia.matches) prefferedTheme = 'light'
		}

		this.computedTheme = superiorTheme || prefferedTheme || defaultTheme || 'light'

		/* ---------------------------- Define userTheme ---------------------------- */

		let themeFromLocalStorage: Theme | undefined

		if (this.keepInLocalStorage) {
			const value = localStorage.getItem(this.localStorageKey)

			if (value) {
				if (value === 'dark' || value === 'light') {
					themeFromLocalStorage = value
				} else {
					console.error('Invalid theme value in localStorage')
				}
			}
		}

		this.userTheme = previousUserTheme || themeFromLocalStorage

		this.afterChange()
	}

	private afterChange() {
		this.subscribers.forEach((subscriber) => subscriber(this.getTheme()))

		if (this.htmlElement) {
			this.htmlElement.classList.remove(this.darkClass, this.lightClass)
			this.htmlElement.classList.add(this.getTheme() === 'dark' ? this.darkClass : this.lightClass)
		}
	}

	public getTheme(): Theme {
		return this.userTheme || this.computedTheme
	}

	private setComputedTheme(theme: Theme) {
		this.computedTheme = theme
		this.afterChange()
	}

	public setTheme(theme: Theme) {
		this.userTheme = theme

		if (this.keepInLocalStorage) {
			localStorage.setItem(this.localStorageKey, theme)
		}

		if (this.onUserSetTheme) {
			this.onUserSetTheme(this.getTheme())
		}

		this.afterChange()
	}

	public subscribe(subscriber: Subscriber): UnsubscribeFunction {
		this.subscribers.push(subscriber)
		return () => (this.subscribers = this.subscribers.filter((s) => s !== subscriber))
	}

	public listen(): UnsubscribeFunction {
		if (this.disablePrefersColorScheme) return () => {}

		const darkListener = (e: MediaQueryListEvent) => e.matches && this.setComputedTheme('dark')
		const lightListener = (e: MediaQueryListEvent) => e.matches && this.setComputedTheme('light')

		this.darkMedia.addEventListener('change', darkListener)
		this.lightMedia.addEventListener('change', lightListener)

		return () => {
			this.darkMedia.removeEventListener('change', darkListener)
			this.lightMedia.removeEventListener('change', lightListener)
		}
	}
}
