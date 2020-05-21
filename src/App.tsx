import React, { useState } from 'react'
import StopWatch from './components/StopWatch'
import {lapTime, PREFERRED_THEME, supportsThemes, THEMES} from './constants'

import './App.scss'

type watchEvent = {
  id: number
  text: string
}

function App() {
  const [ activeTheme, setActiveTheme ] = useState(PREFERRED_THEME.className)
  const [ watchEvents, setWatchEvents ] = useState([] as watchEvent[])

  const addWatchEvent = (text: string) : void => {
    setWatchEvents([ ...watchEvents, { id: Date.now(), text } ])
  }

  const handleStart = () => addWatchEvent('START')
  const handleReset = () => addWatchEvent('RESET')
  const handleLap = (lap: lapTime) => addWatchEvent(`LAP: ${ lap.time }ms`)
  const handlePause = (stopTime: number, laps: lapTime[]) => {
    const eventText = `PAUSE: ${ String(stopTime) }ms, ${ laps.length } laps`
    addWatchEvent(eventText)
  }

  return (
    <div className={`demo-app ${activeTheme}`}>
      <header className='clear-fix'>
        <h1 className='pull-left'>Stop watch demo</h1>
        {supportsThemes && <div className='pull-right'>
          {Object.entries(THEMES).map(([ key, theme ]) => (
            <button
              key={theme.className}
              className={`${activeTheme === theme.className ? 'toggled' : ''}`}
              onClick={() => setActiveTheme(theme.className)}>{key}</button>
          ))}
        </div>}
      </header>
      <main>
        <section className='event-section'>
          <header><strong>Watch events</strong></header>
          {watchEvents.map(event => <div key={event.id}>{event.text}</div>)}
          {watchEvents.length > 0 && <footer className='text-center'>
            <button onClick={() => setWatchEvents([])} >clear</button>
          </footer>}
        </section>
        <section className='component-section'>
          <StopWatch
            onStart={handleStart}
            onPause={handlePause}
            onLap={handleLap}
            onReset={handleReset}
          />
        </section>
      </main>
    </div>
  )
}

export default App
