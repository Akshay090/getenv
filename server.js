
// var ifaces = require('os').networkInterfaces();
var express = require('express');
var app = express();
var path = require('path');

// // Iterate over interfaces ...
// var adresses = Object.keys(ifaces).reduce(function (result, dev) {
//     return result.concat(ifaces[dev].reduce(function (result, details) {
//       return result.concat(details.family === 'IPv4' && !details.internal ? [details.address] : []);
//     }, []));
//   });
  
//   // Print the result
//   console.log(adresses)



app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
    console.log(req.connection.localAddress)
});

app.post('/ok', function (req, res) {
    res.send('Lopgged in')
  })


module.exports = app;