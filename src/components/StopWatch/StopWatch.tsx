import React, { useState, useRef, FunctionComponent } from 'react'

import './StopWatch.scss'
import {ONE_DAY, ONE_HOUR, ONE_MINUTE, ONE_SECOND} from "../../constants";

type StopWatchProps = {
  onStop?: Function
  onLap?: Function
}

const noOp = Function.prototype

const StopWatch:FunctionComponent<StopWatchProps> = function(props) {
  const { onStop = noOp, onLap = noOp} = props
  const [ startTime, setStartTime ] = useState(0)
  const [ isRunning, setIsRunning ] = useState(0)
  const [ lapTimes, setLapTimes ] = useState([])
  const [ elapsedSecond, setElapsedSecond ] = useState(0)
  const timeReadout = useRef<HTMLDivElement>(null)

  const displayTime = (elapsedTime: number) : void => {
    if (timeReadout.current) {
      const hours = Math.trunc((elapsedTime % ONE_DAY) / ONE_HOUR)
      const minutes = Math.trunc((elapsedTime % ONE_HOUR) / ONE_MINUTE)
      const seconds = Math.trunc((elapsedTime % ONE_MINUTE) / ONE_SECOND)
      const secondTenths = Math.trunc((elapsedTime % ONE_SECOND) / 100)

      const timeSegments = [
        hours ? `<span class='hours' >${String(hours).padStart(2, '0')}</span>` : '',
        minutes ? `<span class='minutes' >${String(minutes).padStart(2, '0')}</span>` : '',
        `<span class='seconds' >${String(seconds).padStart(2, '0')}</span>`,
        `<span class='second-tenths' >${String(secondTenths).padStart(2, '0')}</span>`,
      ]
      timeReadout.current.innerHTML = timeSegments.join('')
    }
  }

  const startWatch = () : void => {
    const startTime = Date.now()
    const intervalId = window.setInterval(() => {
      displayTime(Date.now() - startTime)
    }, 100)

    setStartTime(startTime)
    setIsRunning(intervalId)
  }

  const stopWatch = () : void => {
    const elapsedTime = Date.now() - startTime
    setElapsedSecond(Math.trunc((elapsedTime % ONE_SECOND) / 100))
    window.clearInterval(isRunning)
    setIsRunning(0)
  }

  const handleToggleTime = () : void => {
    if (Boolean(isRunning)) {
      stopWatch()
    } else {
      startWatch()
    }
  }

  const handleReset = () : void => {
    stopWatch()
    displayTime(0)
  }

  return <section className={`stop-watch-component ${Boolean(isRunning) ? 'running' : ''}`}>
    <div className='time-display'>
      <div className='spinner' style={{ transform: `rotate(${(elapsedSecond / 10) * 360}deg)` }}/>
      <time >
        <div ref={timeReadout} className='time-container'>
          <span className='seconds' >00</span>
          <span className='second-tenths'>00</span>
        </div>
      </time>
    </div>
    <div className='watch-controls'>
      <button onClick={handleReset}>reset</button>
      <button onClick={handleToggleTime}>{Boolean(isRunning) ? '⏸' : '⏵'}</button>
      <button>lap</button>
    </div>
  </section>
}

export default StopWatch