const {getAllBasicStats, getAdvancedStats} = require('./dataManipulation.js');
const express = require('express')
const cors = require('cors')
const app = express()

const port = 3000
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/basicStats', (req, res) => {
  res.send(getAllBasicStats())
})

app.get('/advancedStats', (req, res) => {
  res.send(getAdvancedStats(req.query.id))
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
