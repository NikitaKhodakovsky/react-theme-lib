It is a simple library for working with themes in React with support of **prefers-color-scheme** media query

<br>

## Table of contents

-   [Installation](#instalation)
-   [Usage](#usage)
-   [Theme Priority](#theme-priority)
-   [Storing theme on the server](#storing-theme-on-the-server)
-   [API](#api)
    -   [ThemeManager](#thememanager)
    -   [ThemeManagerOptions](#thememanageroptions)
    -   [useTheme](#usetheme)
    -   [useThemeManager](#usethememanager)

<br>

# Instalation

```console
npm i react-theme-lib
```

> ⚠️ To use this package, you must have React version 16.8.0 or higher installed

<br>

# Usage

First, you must wrap your application in **\<ThemeProvider />** by passing an instance of **ThemeManager**

```js
import { ThemeManager, ThemeProvider } from 'react-theme-lib'

const manager = new ThemeManager({
    htmlElement: document.getElementById('body') as HTMLElement
})

root.render(
	<ThemeProvider manager={manager}>
		<App />
	</ThemeProvider>
)
```

Then you can use **useTheme** hook inside your components

```js
import { useTheme } from 'react-theme-lib'

function App() {
	const { theme, toggleTheme } = useTheme()

	return (
		<Fragment>
			<div>{theme}</div>
			<button onClick={toggleTheme}>Toggle Theme</button>
		</Fragment>
	)
}
```

A class corresponding to the current theme will be added to the passed element

For example:

```html
<body class="dark">
	...
</body>
```

So you can easily make something like this

```css
body.light {
	--background: #fff;
}

body.dark {
	--background: #333;
}

.element {
	background-color: var(--background);
}
```

<br>

# Theme Priority

This library provides the term "Theme Priority", which must be understood in order to use the library. It is a mechanism for determining the theme on loading

Which can be represented by the following expression:

**userTheme** > **computedTheme**

<br>

## userTheme

This theme is explicitly set by the user by calling setTheme of toggleTheme. This theme is saved in the localStorage and will be read the next time the application is loaded

**previousUserTheme > themeFromLocalStorage**

1. previousUserTheme parameter passed to ThemeManager has priority over the theme stored in localStorage. Used for [Storing theme on the server](#storing-theme-on-the-server)
2. themeFromLocalStorage - Theme previously explicitly specified by the user and saved in localStorage. Automatically retrieved, validated and set in ThemeManager constructor

<br>

## computedTheme

This is theme that is used if the user has not yet explicitly set a theme. Defined from the following parameters in the ThemeManager constructor:

**superiorTheme > prefferedThemeMedia > defaultTheme**

1. superiorTheme - The theme that will be installed when the application first starts up despite on prefers-colour-scheme media and defaultTheme. Should only be used as a last resort, as an application with a good UX should rely on prefers-color-scheme media

2. prefferedThemeMedia - Calculated within the ThemeManager constructor as a result of running prefers-color-scheme media. Takes precedence over the default theme

3. defaultTheme - Theme that is passed as parameter to ThemeManager and has the lowest priority and will be installed if prefers-color-scheme media fails. The default is 'light'.

<br>

# Storing theme on the server

If for some reason you want to store a user-selected theme on the server or elsewhere, you can use **previousUserTheme** and **onUserSetTheme**

```ts
const previousUserTheme = fetchTheme()
const onUserSetTheme = (theme: Theme) => sendThemeToTheServer()

const manager = new ThemeManager({
	previousUserTheme,
	onUserSetTheme
})

const ui = (
	<ThemeProvider manager={manager}>
		<App />
	</ThemeProvider>
)
```

<br>

# API

### Basic types

```ts
type Theme = 'light' | 'dark'

type Subscriber = (t: Theme) => any

type UnsubscribeFunction = () => void
```

<br>

## ThemeManager

The main thing about the library. Accepts optional ThemeManagerOptions

```ts
const manager = new ThemeManger()
```

Provides the following methods:

```ts
getTheme(): Theme

setTheme(theme: Theme): void

subscribe(subscriber: Subscriber): UnsubscribeFunction

listen(): UnsubscribeFunction;
```

These methods are used internally by the library. The only thing you have to do with ThemeManager is to pass it to **\<ThemeProveder/>**

<br>

## ThemeManagerOptions

```ts
interface ThemeManagerOptions {
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
```

| Property                  | Description                                                                                                                     |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| previousUserTheme         | [Described in Storing theme on the server](#storing-theme-on-the-server)                                                        |
| superiorTheme             | [Described in Theme Priority section](#theme-priority)                                                                          |
| defaultTheme              | [Described in Theme Priority section](#theme-priority)                                                                          |
| keepInLocalStorage        | Whether to save theme selected by the user to the localStorage. By default - **true**                                           |
| localStorageKey           | The key under which the theme selected by the user will be stored in the localStorage. By default = 'theme'                     |
| htmlElement               | Element to which a class will be added, depending on the theme                                                                  |
| onChange                  | Listener, which will be called when the theme changes                                                                           |
| onUserSetTheme            | [Described in Storing theme on the server](#storing-theme-on-the-server)                                                        |
| disablePrefersColorScheme | The flag that specifies whether ThemeManager will consider prefers-color-scheme when calculating computedTheme                  |
| customLightClass          | The class that will be added when theme === 'light' to the passed component. If not specified, 'light' will be added by default |
| customDarkClass           | The class that will be added when theme === 'dark' to the passed component. If not specified, 'dark' will be added by default   |

<br>

## ThemeProvider

React context provider that takes an instance of ThemeManager and makes it available for useThemeManager and useTheme hooks. Also responsible for setting eventListeners on prefers-color-scheme media.

```tsx
const manager = new ThemeManager()

const ui = (
	<ThemeProvider manager={manager}>
		<App />
	</ThemeProvider>
)
```

> If you haven't explicitly set [UserTheme](#theme-priority) yet, you can change the theme in your operating system, and it will automatically change in your application because of eventListeners on prefers-color-scheme media

<br>

## useTheme

Hook, which provides access to the core React API of this library.

```tsx
interface UseThemeResult {
	theme: Theme
	isDark: boolean
	isLight: boolean
	setTheme: (theme: Theme) => void
	toggleTheme: () => void
}

function useTheme(): UseThemeResult
```

| Property    | Description                                                    |
| ----------- | -------------------------------------------------------------- |
| theme       | Current theme                                                  |
| isDark      | true if theme === 'dark'                                       |
| isLight     | true if theme === 'light'                                      |
| setTheme    | The function that sets the theme                               |
| toggleTheme | A function that switches the current theme to the opposite one |

<br>

## useThemeManager

Hook, which returns the current instance of ThemeManager

```ts
function useThemeManager(): ThemeManager
```
