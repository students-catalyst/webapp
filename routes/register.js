var express = require('express');
let querystring = require('querystring');
let http = require('http');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('register', { title: 'Bioskop Kampus Itb' });
});

router.post('/', function(req,res,next) {
  const postData = querystring.stringify({
    emailInput: req.body.emailInput,
    passwordInput1: req.body.passwordInput1,
    passwordInput2: req.body.passwordInput2,
    namaInput : req.body.namaInput,
    nikInput : req.body.nikInput
  });  
  
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/users/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };
  
  
  const request = http.request(options, (response) => {
    response.setEncoding('utf8');
    response.on('data', (chunk) => {
      console.log('Response: ' + chunk);
      res.redirect('/');
    });
  });
  
  request.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });
  
  // write data to request body
  request.write(postData);
  request.end();
});

module.exports = router;
