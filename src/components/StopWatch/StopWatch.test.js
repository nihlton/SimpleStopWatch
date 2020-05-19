import React from 'react'
import { render, fireEvent, cleanup } from '@testing-library/react'
import StopWatch from './StopWatch'

jest.useRealTimers()

const waitMS = ms => new Promise(resolve => setTimeout(() => resolve(), ms))
const TEST_PRECISION = 30 // in milliseconds.  allow for render and test work
const TEST_WAIT_TIME = 300 // time between play/pause/lap clicks

afterEach(cleanup)

test('provides three control buttons', () => {
  const { getByText } = render(<StopWatch />)
  const resetButton = getByText('reset')
  const playButton = getByText('⏵')
  const lapButton = getByText('lap')
  expect(resetButton).toBeInTheDocument()
  expect(playButton).toBeInTheDocument()
  expect(lapButton).toBeInTheDocument()
  expect(lapButton.disabled).toBe(true)
})

test('starts timer when user clicks `play`',  async () => {
  const { getByText, getByTestId } = render(<StopWatch />)
  const WAIT_TIME = 1234
  
  fireEvent.click(getByText('⏵'))
  
  await waitMS(WAIT_TIME)
  
  const pauseButton = getByText('⏸')
  const lapButton = getByText('lap')
  const displayedTime = Number(getByTestId('time-display').textContent) * 10 // tenths to milli
  
  expect(Math.abs(WAIT_TIME - displayedTime)).toBeLessThan(TEST_PRECISION)
  expect(pauseButton).toBeInTheDocument()
  expect(lapButton.disabled).toBe(false)
})

test('pauses timer when user clicks `pause`',  async () => {
  const { getByText, getByTestId } = render(<StopWatch />)
  
  fireEvent.click(getByText('⏵'))
  
  await waitMS(TEST_WAIT_TIME)
  
  fireEvent.click(getByText('⏸'))
  
  await waitMS(TEST_WAIT_TIME)
  
  // waited N ms, clicked pause, waited another N ms.  UI should read N ms, not N+N.
  
  const playButton = getByText('⏵')
  const lapButton = getByText('lap')
  const displayedTime = Number(getByTestId('time-display').textContent) * 10 // tenths to milli
  
  expect(Math.abs(TEST_WAIT_TIME - displayedTime)).toBeLessThan(TEST_PRECISION) // allow render and tests.
  expect(playButton).toBeInTheDocument()
  expect(lapButton.disabled).toBe(true)
})

test('resumed timer continues where it left off',  async () => {
  const { getByText, getByTestId } = render(<StopWatch />)
  
  fireEvent.click(getByText('⏵'))
  
  await waitMS(TEST_WAIT_TIME)
  
  fireEvent.click(getByText('⏸'))
  
  await waitMS(TEST_WAIT_TIME)
  
  fireEvent.click(getByText('⏵'))
  
  await waitMS(TEST_WAIT_TIME)
  
  const playButton = getByText('⏸')
  const lapButton = getByText('lap')
  const displayedTime = Number(getByTestId('time-display').textContent) * 10 // tenths to milli
  
  expect(Math.abs((TEST_WAIT_TIME * 2) - displayedTime)).toBeLessThan(TEST_PRECISION)
  expect(playButton).toBeInTheDocument()
  expect(lapButton.disabled).toBe(false)
})


test('clicking `lap` adds a lap record',  async () => {
  const { getByText, getByTestId } = render(<StopWatch />)
  
  fireEvent.click(getByText('⏵'))
  
  await waitMS(TEST_WAIT_TIME)
  fireEvent.click(getByText('lap'))
  
  await waitMS(TEST_WAIT_TIME)
  fireEvent.click(getByText('lap'))
  
  await waitMS(TEST_WAIT_TIME)
  fireEvent.click(getByText('lap'))
  
  fireEvent.click(getByText('⏸'))
  
  Array.from(getByTestId('lap-records').children).reverse().forEach((lapRecord, i) => {
    const [ lapTimeDisplay, lapFromStartDisplay ] = Array.from(lapRecord.children)
    const lapTime = Number(lapTimeDisplay.textContent.replace(/:/g, '')) * 10 // tenths to milli
    const lapFromStart = Number(lapFromStartDisplay.textContent.replace(/:/g, '')) * 10 // tenths to milli
    
    expect(Math.abs(TEST_WAIT_TIME - lapTime)).toBeLessThan(TEST_PRECISION)
    expect(Math.abs((TEST_WAIT_TIME * (i + 1)) - lapFromStart)).toBeLessThan(TEST_PRECISION)
  })
})

test('clicking `reset` should clear the time display, and the lap records',  async () => {
  const { getByText, getByTestId, queryByTestId } = render(<StopWatch />)
  
  fireEvent.click(getByText('⏵'))
  
  await waitMS(TEST_WAIT_TIME)
  fireEvent.click(getByText('lap'))
  
  fireEvent.click(getByText('⏸'))
  fireEvent.click(getByText('reset'))
  
  const lapRecords = queryByTestId('lap-records')
  const displayedTime = Number(getByTestId('time-display').textContent)
  
  expect(lapRecords).toBeNull()
  expect(displayedTime).toBe(0)
})


test('calls provided handlers',  async () => {
  const noOp = Function.prototype
  const mockStart = jest.fn(noOp)
  const mockPause = jest.fn(noOp)
  const mockLap = jest.fn(noOp)
  const mockReset = jest.fn(noOp)
  
  const { getByText } = render(<StopWatch
    onStart={mockStart}
    onPause={mockPause}
    onLap={mockLap}
    onReset={mockReset}
  />)
  
  fireEvent.click(getByText('⏵'))
  expect(mockStart).toHaveBeenCalled()
  
  fireEvent.click(getByText('lap'))
  expect(mockLap).toHaveBeenCalled()
  
  fireEvent.click(getByText('⏸'))
  expect(mockPause).toHaveBeenCalled()
  
  fireEvent.click(getByText('reset'))
  expect(mockReset).toHaveBeenCalled()
})

