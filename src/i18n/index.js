import en from './en'

const DEFAULT_LANGUAGE = en
const supported = { en }
const languages = window.navigator.languages || [window.navigator.language || window.navigator.userLanguage]
const firstSupported = languages.find(lng => supported[lng])


export default supported?.[firstSupported] || DEFAULT_LANGUAGE
