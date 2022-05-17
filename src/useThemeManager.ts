import { useContext } from 'react'
import { defaultThemeManagerWarning } from './messages'
import { ThemeContext } from './ThemeContext'
import { ThemeManager } from './ThemeManager'

export function useThemeManager(): ThemeManager {
	const themeManager = useContext(ThemeContext)

	//@ts-ignore
	if (themeManager.default && process.env.NODE_ENV !== 'production') {
		console.warn(defaultThemeManagerWarning)
	}

	return themeManager
}
