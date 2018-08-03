const app = require('./app');
const http = require('http');

let port = (process.env.PORT || 3000);
http.createServer(app).listen(port);
console.log(`Server listens on port ${port}`);
