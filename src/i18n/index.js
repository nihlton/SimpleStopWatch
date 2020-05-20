import en from './en'
//import zh from './zh'
//import ha from './ha'
//import es from './es'
//import ar from './ar'

const DEFAULT_LANGUAGE = en
const supported = {
  en,
  //zh,
  //ha,
  //es,
  //ar,
}

const languages = window.navigator.languages || [window.navigator.language || window.navigator.userLanguage]

const firstSupported = languages.find(lng => supported[lng])

export default supported?.[firstSupported] || DEFAULT_LANGUAGE
