
export const noOp = Function.prototype

export type themeDef = {
  className: string
  query?: string
}

export type themeMap = {
  [key: string]: themeDef
}

export const THEMES = {
  light: { className: 'theme-light', query: '(prefers-color-scheme: light)' },
  dark: { className: 'theme-dark', query:  '(prefers-color-scheme: dark)' },
} as themeMap

export const DEFAULT_THEME = THEMES.light

// doesn't listen live, for simplicity sake
export const PREFERRED_THEME = window?.matchMedia ? Object.values(THEMES).reduce(
    (cTheme: themeDef, aTheme: themeDef) => (
      aTheme.query && window.matchMedia(aTheme.query).matches ? aTheme : cTheme
    ), DEFAULT_THEME) : DEFAULT_THEME

export const ONE_SECOND = 1000
export const ONE_MINUTE = ONE_SECOND * 60
export const ONE_HOUR = ONE_MINUTE * 60
export const ONE_DAY = ONE_HOUR * 24
export const ONE_YEAR = ONE_DAY * 365

export type StopWatchProps = {
  onReset?: Function
  onStart?: Function
  onPause?: Function
  onLap?: Function
}

export type lapTime = {
  id: number,
  time: number,
  fromStart: number
}