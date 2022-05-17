import { useEffect, useState } from 'react'
import { Theme, UseThemeResult } from './types'
import { useThemeManager } from './useThemeManager'

export function useTheme(): UseThemeResult {
	const themeManager = useThemeManager()
	const [theme, subscriber] = useState<Theme>(themeManager.getTheme())

	useEffect(() => {
		return themeManager.subscribe(subscriber)
	}, [themeManager])

	function toggleTheme(..._: any[]) {
		const currentTheme = themeManager.getTheme()

		if (currentTheme === 'dark') {
			themeManager.setTheme('light')
		} else if (currentTheme === 'light') {
			themeManager.setTheme('dark')
		}
	}

	return {
		theme,
		setTheme: themeManager.setTheme,
		toggleTheme,
		isDark: theme === 'dark',
		isLight: theme === 'light'
	}
}
