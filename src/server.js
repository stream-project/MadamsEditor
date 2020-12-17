'use strict';

const express = require('express');
const bodyParser = require('body-parser')
const rmlParser = require("rocketrml");

// Constants
const { PORT = '3000' } = process.env
const HOST = '0.0.0.0';

// App
const app = express();
// parse json
app.use(bodyParser.json())
// set header
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');

    next();
})
// option request
app.options("/*", function(req, res, next){
    return res.sendStatus(200);
});

// routes
app.get('/', (req, res) => {
    res.send('Howdy, wrong route...');
});

app.post('/rmlmapper', async (req, res, next) => {
    req.accepts('application/json')

    const mapping = req.body.rml || false;
    const sources = req.body.sources || false;
    if (!mapping || !sources) {
        return res.status(500).send({ error: 'Parameter missing!' })
    }


    const options = {
        toRDF: true,
        verbose: false,
        xmlPerformanceMode: false,
        replace: false,
        functions: {
            'https://github.com/AKSW/MadamsEditor/functions.ttl#toUpperCase': function (str) {
                return str[0].toUpperCase();
            }
        }
    };

    try {
        const ret = await rmlParser.parseFileLive(mapping, sources, options);
        res.send(ret)
    } catch (error) {
        res.status(500).send({ error: error.toString() });
    }

})

app.listen(PORT, HOST);
console.log(`Running on server http://${HOST}:${PORT}`);