const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const user = require('./routes/route');
const app = express()
const config = require('./configurations')

// set up  mongo db connection
const mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/UserDatabase')
mongoose.connect(config.mongodbPath)
    .then(() => console.log('Now connected to MongoDB!'))
    .catch(err => console.error('Something went wrong', err));


app.use(bodyParser.json())
app.use('/api', user)
app.listen(process.env.port || 3000 ,'0.0.0.0');
 
