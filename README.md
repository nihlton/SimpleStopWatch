## Simple Stop Watch

[live demo](https://nihlton.github.io/simple-stop-watch/)

`yarn install`
`yarn start`
or
`npm install`
`npm start`

### Usage
```
import StopWatch from './components/StopWatch'
...
<StopWatch  
  onStart={handleStart}  
  onPause={handlePause}  
  onLap={handleLap}  
  onReset={handleReset}  
/>
```