// Dependencies
const express = require('express')
const app = express()

// App Definition
app.use(express.static('public'))
app.listen(5050, function() {
    console.log('app is now listening on *:5050');
});