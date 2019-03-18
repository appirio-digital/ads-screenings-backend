const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const router = express.Router()
const app = express()
const configuration = require('./configurations')

router.get('/', (req,res) => {
    res.send('Hello World');
})

app.use(bodyParser.json())
app.use('/api', router)
app.listen(configuration.port || process.env.port || 3000);