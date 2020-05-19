export type themeDef = {
  className: string
  query?: string
}

type themeMap = {
  [key: string]: themeDef
}

export const THEMES = {
  light: { className: 'theme-light', query: '(prefers-color-scheme: light)' },
  dark: { className: 'theme-dark', query:  '(prefers-color-scheme: dark)' },
} as themeMap

export const DEFAULT_THEME = THEMES.light

// doesn't listen live, for simplicity sake
export const PREFERRED_THEME = Object.values(THEMES).reduce(
    (currentTheme: themeDef, theme: themeDef) => {
      return theme.query && window.matchMedia(theme.query).matches ? theme : currentTheme
    },
    DEFAULT_THEME)

export const ONE_MILLI_SECOND = 1
export const ONE_SECOND = ONE_MILLI_SECOND * 1000
export const ONE_MINUTE = ONE_SECOND * 60
export const ONE_HOUR = ONE_MINUTE * 60
export const ONE_DAY = ONE_HOUR * 24
export const ONE_YEAR = ONE_DAY * 365
