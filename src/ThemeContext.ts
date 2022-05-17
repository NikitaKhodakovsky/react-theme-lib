import { Context, createContext } from 'react'
import { ThemeManager } from './ThemeManager'

const defaultThemeManager = new ThemeManager()

//@ts-ignore
defaultThemeManager.default = true

export const ThemeContext: Context<ThemeManager> = createContext(defaultThemeManager)
