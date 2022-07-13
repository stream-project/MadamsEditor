'use strict';

const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const RMLMapperWrapper = require('@rmlio/rmlmapper-java-wrapper');
const fs = require('fs');

// Constants
const { SERVER_PORT = '3000' } = process.env
const HOST = '0.0.0.0';

// App
const app = express();
const router = express.Router();

app.use(cors());
app.options('*', cors());

// set header
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
})

// parse json
app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', router);

// routes
app.get('/', (req, res) => {
    res.send('Howdy!');
});

/**
 * @api {post} /rmlmapper
 * @apiName RML mapper
 *
 * @apiDescription Execute the RML mapper
 * @apiParam {String} RML mapping
 * @apiParam {String} Sources
 * @apiSuccess
 */
app.post('/rmlmapper', async (req, res, next) => {
    req.accepts('application/json')

    const mapping = req.body.rml.replace('data.file', 'temp/output.turtle') || false;
    const sources = req.body.sources || false;
    if (!mapping || !sources) {
        return res.status(500).send({ error: 'Parameter missing!' })
    }

    try {
      fs.writeFileSync('temp/output.turtle', sources[Object.keys(sources)[0]].toString());
      fs.writeFileSync('temp/mapping.rml.ttl', mapping);
      // file written successfully
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: 'There is an issue with the server - contact an admin.' });
    }

    const rmlmapperPath = 'rmlmapper.jar';
    const tempFolderPath = './temp/';

    const rml = fs.readFileSync('temp/mapping.rml.ttl', 'utf-8');
    const sourcesFile = {
      'output.turtle': fs.readFileSync('temp/output.turtle', 'utf-8')
    };

    const wrapper = new RMLMapperWrapper(rmlmapperPath, tempFolderPath, true);

    try {
        const ret = await wrapper.execute(rml, {sourcesFile, generateMetadata: false, serialization: 'turtle'});
        res.send(ret.output)
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: error.toString() });
    }
})

const predefinedFunctions = () => {
    const namespace = 'https://github.com/AKSW/MadamsEditor/functions.ttl#';

    const toUpperCase = ([str]) => str.toString().toUpperCase();

    const toLowerCase = ([str]) => str.toString().toLowerCase();

    return [toUpperCase, toLowerCase]
        .reduce((o, cur) => {
            return Object.assign(o, {[namespace + cur.name]: cur})
        }, {});
}

app.listen(SERVER_PORT, HOST);
console.log(`RML server http://${HOST}:${SERVER_PORT}`);
