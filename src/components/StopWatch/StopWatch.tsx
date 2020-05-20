import React, { useState, useRef, FunctionComponent } from 'react'
import { padSegments, parseTime } from '../../util/timeUtils'
import { lapTime, noOp, StopWatchProps } from '../../constants'
import transText from '../../i18n'
import { supportsSpeechSynthesis, utter } from '../../util/speechUtils'

import './StopWatch.scss'

const StopWatch:FunctionComponent<StopWatchProps> = function(props) {
  const { onReset = noOp, onStart = noOp, onPause = noOp, onLap = noOp} = props
  const [ speakTime, setSpeakTime ] = useState(false)
  const [ startTime, setStartTime ] = useState(0)
  const [ stopTime, setStopTime ] = useState(0)
  const [ isRunning, setIsRunning ] = useState(0)
  const [ lapTimes, setLapTimes ] = useState([] as lapTime[])
  const displayTimeRef = useRef<HTMLDivElement>(null)
  const readTimeRef = useRef<HTMLDivElement>(null)
  const readLapRef = useRef<HTMLDivElement>(null)

  const displayTime = (elapsedTime: number) : void => {
    if (displayTimeRef.current) {
      const [ days, hours, minutes, seconds, secondTenths ] = padSegments(parseTime(elapsedTime))

      const timeSegmentMarkup = [
        days && `<span class='days' >${days}</span>` ,
        hours && `<span class='hours' >${hours}</span>`,
        minutes && `<span class='minutes' >${minutes}</span>`,
        `<span class='seconds' >${seconds}</span>`,
        `<span class='second-tenths' >${secondTenths}</span>`,
      ]
      displayTimeRef.current.innerHTML = timeSegmentMarkup.join('')
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
    displayTime(elapsedTime)
    readTime(elapsedTime)

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
      const thisLapDuration = elapsedTime - lastLapEnd
      const thisLapTime = {
        id: rightNow,
        time: thisLapDuration,
        fromStart: elapsedTime
      } as lapTime

      readLap(thisLapDuration)
      setLapTimes([...lapTimes, thisLapTime])

      onLap(thisLapTime)
    }
  }

  const readTime = (elapsedTime : number) : void => {
    const timeLanguage = timeToLanguage(elapsedTime)
    if (readTimeRef.current) {
      readTimeRef.current.innerHTML = timeLanguage
    }
    if (speakTime && supportsSpeechSynthesis) { utter(timeLanguage) }
  }

  const readLap = (elapsedTime : number) : void => {
    const lapLanguage = `${transText.lap} ${lapTimes.length + 1}, ${timeToLanguage(elapsedTime)}`
    if (readLapRef.current) {
      readLapRef.current.innerHTML = lapLanguage
    }
    if (speakTime && supportsSpeechSynthesis) { utter(lapLanguage) }
  }

  const timeToLanguage = (elapsedTime : number) : string => {
    const [ days, hours, minutes, seconds, secondTenths ] = parseTime(elapsedTime)
    const daysLang = days ? `${days} ${days > 1 ? transText.days : transText.day}` : ''
    const hoursLang = hours ? `${hours} ${hours > 1 ? transText.hours : transText.hour}` : ''
    const minutesLang = minutes ? `${minutes} ${minutes > 1 ? transText.minutes : transText.minute}` : ''
    const secondsLang = seconds || secondTenths ? `${seconds} point ${secondTenths}  ${transText.seconds}` : ''

    return [daysLang, hoursLang, minutesLang, secondsLang].filter(ts => ts).join(', ')
  }

  return <section className='stop-watch-component'>
    <div ref={readTimeRef} className='sr-only' aria-live='assertive'/>
    <div ref={readLapRef} className='sr-only' aria-live='assertive'/>

    {supportsSpeechSynthesis && <button
      className='speak-toggle icon'
      onClick={() => setSpeakTime(!speakTime)}>
      {speakTime ? <i className='fa fa-volume-up' /> : <i className='fa fa-volume-off' />}
      <span className='sr-only'>toggle speech synthesis</span>
    </button>}

    <time className='time-display x-large-padding-top' role='timer' >
      <div ref={displayTimeRef} >
        <span className='seconds' >00</span>
        <span className='second-tenths'>00</span>
      </div>
    </time>

    <div className='watch-controls text-center large-padding-top'>
      <button className='small on-foreground' onClick={handleReset}>{transText.reset}</button>
      <button
        onClick={handleToggleTime}
        className={`round on-foreground ${Boolean(isRunning) ? 'toggled' : ''}`}>
        {Boolean(isRunning) ? <i className='fa fa-pause' /> : <i className='fa fa-play' />}
        {Boolean(isRunning) ? <span className='sr-only'>{transText.pause}</span> : <span className='sr-only'>{transText.play}</span>}
      </button>
      <button className='small on-foreground' onClick={handleLap} disabled={!Boolean(isRunning)}>{transText.lap}</button>
    </div>

    {lapTimes.length > 0 && <aside className='lap-times'>
      <div>
        <strong className='small-padding-bottom'>{transText.lapTimes}</strong>
        <ul>
          {[...lapTimes].reverse()
            .map(lap => [lap.id, parseTime(lap.time), parseTime(lap.fromStart)])
            .map(([id, time, fromStart], i) => <li key={String(id)}>
              #{String(lapTimes.length - i).padStart(2, '0')} -&nbsp;
              <span>{padSegments(time as Array<number>).filter(s => s).join(':')}</span> -&nbsp;
              <span>{padSegments(fromStart as Array<number>).filter(s => s).join(':')}</span>
            </li>)
          }
        </ul>
      </div>
    </aside>}
  </section>
}

export default StopWatch