import React, { useState, FunctionComponent } from 'react'

import './StopWatch.scss'

type StopWatchProps = {
    onStop?: Function
    onLap?: Function
}

const noOp = Function.prototype

const StopWatch:FunctionComponent<StopWatchProps> = function(props) {
    const { onStop = noOp, onLap = noOp} = props
    const [ startTime, setStartTime ] = useState()
    const [ isRunning, setIsRunning ] = useState(false)
    const [ lapTimes, setLapTimes ] = useState([])

    return <section className='stop-watch-component'>

    </section>
}

export default StopWatch