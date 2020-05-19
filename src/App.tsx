import React, { useState } from 'react'
import StopWatch from './components/StopWatch'
import {PREFERRED_THEME, THEMES} from './constants'

import './App.scss'

function App() {
  const [ activeTheme, setActiveTheme ] = useState(PREFERRED_THEME.className)
  
  return (
    <div className={`demo-app ${activeTheme}`}>
      <header className='clear-fix'>
        <h1 className='pull-left'>Stop watch demo</h1>
        <div className='pull-right'>
          {Object.entries(THEMES).map(([key, theme]) => (
            <button
              key={theme.className}
              className={`${activeTheme === theme.className ? 'toggled' : ''}`}
              onClick={() => setActiveTheme(theme.className)}>{key}</button>
          ))}
        </div>
      </header>
      <main>
        <section>
        </section>
        <section>
          <StopWatch />
        </section>

      </main>
    </div>
  )
}

export default App
