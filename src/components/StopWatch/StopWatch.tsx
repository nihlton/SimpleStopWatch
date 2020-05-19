import React, { useState, useRef, FunctionComponent } from 'react'
import {ONE_DAY, ONE_HOUR, ONE_MINUTE, ONE_SECOND, ONE_YEAR} from "../../constants";

import './StopWatch.scss'

type StopWatchProps = {
  onReset?: Function
  onStart?: Function
  onStop?: Function
  onLap?: Function
}

const noOp = Function.prototype

const StopWatch:FunctionComponent<StopWatchProps> = function(props) {
  const { onReset = noOp, onStart = noOp, onStop = noOp, onLap = noOp} = props
  const [ startTime, setStartTime ] = useState(0)
  const [ isRunning, setIsRunning ] = useState(0)
  const [ lapTimes, setLapTimes ] = useState([] as number[])
  const [ elapsedSecond, setElapsedSecond ] = useState(0)
  const timeReadout = useRef<HTMLDivElement>(null)

  const displayTime = (elapsedTime: number) : void => {
    if (timeReadout.current) {
      const days = Math.trunc((elapsedTime % ONE_YEAR) / ONE_DAY)
      const hours = Math.trunc((elapsedTime % ONE_DAY) / ONE_HOUR)
      const minutes = Math.trunc((elapsedTime % ONE_HOUR) / ONE_MINUTE)
      const seconds = Math.trunc((elapsedTime % ONE_MINUTE) / ONE_SECOND)
      const secondTenths = Math.trunc((elapsedTime % ONE_SECOND) / 100)

      const timeSegments = [
        days ? `<span class='days' >${String(days).padStart(2, '0')}</span>` : '',
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

    onStart(startTime)
    setStartTime(startTime)
    setIsRunning(intervalId)
  }

  const stopWatch = () : void => {
    const elapsedTime = Date.now() - startTime
    setElapsedSecond(Math.trunc((elapsedTime % ONE_SECOND) / 100))
    window.clearInterval(isRunning)
    setIsRunning(0)
    onStop([elapsedTime, lapTimes])
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
    setElapsedSecond(0)
    setLapTimes([])
    onReset()
  }

  const handleLap = () : void => {
    const elapsedTime = Date.now() - startTime
    const newLapTimes = [...lapTimes, elapsedTime]
    setLapTimes(newLapTimes)
    onLap(newLapTimes)
  }

  return <section className={`stop-watch-component ${Boolean(isRunning) ? 'running' : ''}`}>
    <div className='time-display large-margin-top'>
      <div className='spinner' style={{ transform: `rotate(${(elapsedSecond / 10) * 360}deg)` }}/>
      <time >
        <div ref={timeReadout} className='time-container'>
          <span className='seconds' >00</span>
          <span className='second-tenths'>00</span>
        </div>
      </time>
    </div>
    <div className='watch-controls text-center large-padding-top'>
      <button className='small' onClick={handleReset}>reset</button>
      <button
        onClick={handleToggleTime}
        className={`big round ${Boolean(isRunning) ? 'toggled' : ''}`}>{Boolean(isRunning) ? '⏸' : '⏵'}</button>
      <button className='small' onClick={handleLap}>lap</button>
    </div>
  </section>
}

export default StopWatch