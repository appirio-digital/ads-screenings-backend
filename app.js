const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const user = require('./routes/route');
const app = express()
const config = require('./configurations')
const cors = require('cors');

// set up  mongo db connection
const mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/UserDatabase')
mongoose.connect(config.mongodbPath)
    .then(() => console.log('Now connected to MongoDB!'))
    .catch(err => console.error('Something went wrong', err));


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));
app.use('/api', user ,cors())

app.listen(process.env.PORT || config.port ,'0.0.0.0');
 
