const app = require('./app');
const http = require('http');
const server = http.createServer(app);

let port = (process.env.PORT || 3001);
server.listen(port);
console.log(`Server listens on port ${port}`);

var sockets = require('./sockets');
sockets.socketServer(app, server);

