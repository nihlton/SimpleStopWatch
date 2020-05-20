export const utter = (text: string) : void => {
  // say a thing
  if (window.speechSynthesis) {
    const thisUtterance = new window.SpeechSynthesisUtterance()
    thisUtterance.text = text
    window.speechSynthesis.speak(thisUtterance)
  }
}

export const supportsSpeechSynthesis = Boolean(window.speechSynthesis)
