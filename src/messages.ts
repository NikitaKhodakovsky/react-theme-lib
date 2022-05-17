export const defaultThemeManagerWarning = `
    Detected using of useThemeManager outside <ThemeProvider/>. Possible unexpected behavior. To work correctly you should wrap components which using useThemeManager in <ThemeProvider/>
    
    👷 This message appears only in development mode and will be deleted when NODE_ENV === 'production'
    `
