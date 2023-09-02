const dtro = require('./dtro.js');

const http = require('http');
http.createServer(async (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8;',
        'Access-Control-Allow-Origin': '*'
    });
    res.write(JSON.stringify(dtro(), null, 4));
    res.end();
}).listen(81);
