const app = require('./app');
const http = require('http');
const server = http.createServer(app);

let port = (process.env.PORT || 8080);

server.listen(port);
console.log(`Server listens on port ${port}`);


