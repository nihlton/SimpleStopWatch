import React, { useState, useRef, FunctionComponent } from 'react'
import { padSegments, parseTime } from '../../util/timeMethods'
import { lapTime, noOp, StopWatchProps } from '../../constants'

import './StopWatch.scss'

const StopWatch:FunctionComponent<StopWatchProps> = function(props) {
  const { onReset = noOp, onStart = noOp, onPause = noOp, onLap = noOp} = props
  const [ startTime, setStartTime ] = useState(0)
  const [ stopTime, setStopTime ] = useState(0)
  const [ isRunning, setIsRunning ] = useState(0)
  const [ lapTimes, setLapTimes ] = useState([] as lapTime[])
  const timeReadout = useRef<HTMLDivElement>(null)

  const displayTime = (elapsedTime: number) : void => {
    if (timeReadout.current) {
      const [ days, hours, minutes, seconds, secondTenths ] = padSegments(parseTime(elapsedTime))

      const timeSegmentMarkup = [
        days && `<span class='days' >${days}</span>` ,
        hours && `<span class='hours' >${hours}</span>`,
        minutes && `<span class='minutes' >${minutes}</span>`,
        `<span class='seconds' >${seconds}</span>`,
        `<span class='second-tenths' >${secondTenths}</span>`,
      ]
      timeReadout.current.innerHTML = timeSegmentMarkup.join('')
    }
  }

  const startWatch = () : void => {
    const newStartTime = Date.now() - (stopTime - startTime)
    const intervalId = window.setInterval(() => {
      displayTime(Date.now() - newStartTime)
    }, 10)

    setStartTime(newStartTime)
    setIsRunning(intervalId)

    onStart(newStartTime)
  }

  const pauseWatch = () : void => {
    const rightNow = Date.now()
    const elapsedTime = rightNow - startTime

    window.clearInterval(isRunning)

    setStopTime(rightNow)
    setIsRunning(0)

    onPause(elapsedTime, lapTimes)
  }

  const handleToggleTime = () : void => {
    if (Boolean(isRunning)) {
      pauseWatch()
    } else {
      startWatch()
    }
  }

  const handleReset = () : void => {
    window.clearInterval(isRunning)
    displayTime(0)
    setIsRunning(0)
    setStartTime(0)
    setStopTime(0)
    setLapTimes([])

    onReset()
  }

  const handleLap = () : void => {
    if (Boolean(isRunning)) {
      const rightNow = Date.now()
      const elapsedTime = rightNow - startTime
      const lastLapEnd = lapTimes.slice(-1)[0]?.fromStart ?? 0
      const thisLapTime = {
        id: rightNow,
        time: elapsedTime - lastLapEnd,
        fromStart: elapsedTime
      } as lapTime

      const newLapTimes = [...lapTimes, thisLapTime]
      setLapTimes(newLapTimes)
      onLap(thisLapTime)
    }
  }

  return <section className='stop-watch-component'>
    <time className='time-display large-margin-top' data-testid='time-display'>
      <div ref={timeReadout} >
        <span className='seconds' >00</span>
        <span className='second-tenths'>00</span>
      </div>
    </time>

    <div className='watch-controls text-center large-padding-top'>
      <button className='small on-foreground' onClick={handleReset}>reset</button>
      <button
        onClick={handleToggleTime}
        className={`round on-foreground ${Boolean(isRunning) ? 'toggled' : ''}`}>
        {Boolean(isRunning) ? <i className='fa fa-pause' /> : <i className='fa fa-play' />}
        {Boolean(isRunning) ? <span className='sr-only'>pause</span> : <span className='sr-only'>play</span>}
      </button>
      <button className='small on-foreground' onClick={handleLap} disabled={!Boolean(isRunning)}>lap</button>
    </div>

    {lapTimes.length > 0 && <aside className='lap-times'>
      <div>
        <strong className='small-padding-bottom'>Lap times</strong>
        <div data-testid='lap-records'>
          {[...lapTimes].reverse()
            .map(lap => [lap.id, parseTime(lap.time), parseTime(lap.fromStart)])
            .map(([id, time, fromStart], i) => <div key={String(id)}>
              #{String(lapTimes.length - i).padStart(2, '0')} -&nbsp;
              <span>{padSegments(time as Array<number>).filter(s => s).join(':')}</span> -&nbsp;
              <span>{padSegments(fromStart as Array<number>).filter(s => s).join(':')}</span>
            </div>)
          }
        </div>
      </div>
    </aside>}

  </section>
}

export default StopWatch