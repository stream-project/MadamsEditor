# RML (YARRRML) Editor

(yet simple) Text based editor to map JSON or CSV data with [YARRRML](http://rml.io/yarrrml/) (a human-readible form of RDF Mapping Language [[RML](https://rml.io/specs/rml/)]) to RDF.

The RML to YARRRML and vice versa is based on [YARRRML-Parser](https://github.com/RMLio/yarrrml-parser).

To apply the mappings on the data an RML Mapper service is **required**. We use the Java library [RMLMapper](https://github.com/RMLio/rmlmapper-java) for this.

## Screenshot

![Screenshot](./rmleditor.png)

## Deployment

This software consists of two parts: the GUI (VueJS 3) and the middleware (NodeJS).

Both have to be started manually or in docker.

## Manually

Installation:
`npm install`

Service:
`npm run service`

GUI:
`npm run serve`

## Docker

Use the images from Github: ghcr.io/stream-project/rmleditor:master

In this repository is also an example docker-compose file.

## Usage as library

```js
new MadamsEditor({
    // JSON DATA: url to a json ressource or JSON object as value
    'data': {
        'type': 'url' ,  // url|json
        'value': './dist/example-data.json',  // string|json
        'name': '' // string (required for json)
    },
    // MAPPING: url to yaml (yarrrml) ressource, or yaml (yarrrml) as string
    'mapping': {
        'type': 'url' , // url|yaml
        'value': './dist/example-mapping.yml', // string
        'name': '' // string (required for yaml)
    },
    // url to RML mapper service
    'rmlMapperUrl': 'http://localhost:3000/rmlmapper',
    // callback method after run
    run: function(mapping, result) { }
});
```

## CD

Github Action does publish the docker image on Githubs registry. At the end of the workflow a webhook on the stream server is called which does redeploy the RMLEditor.

You could do it by yourself also:
`curl -v stream-dataspace.net:81/hooks/redeploy -H "Authorization: secret" --data "redeploy=rmleditor" -X POST`
The secret value could be found in the webhook config on the server.

## Ressources

- [RML](https://rml.io/specs/rml/)
- [YARRRML](https://rml.io/yarrrml/spec/)
- [JSONPath](https://goessner.net/articles/JsonPath/index.html), [more JSONPath](https://gregsdennis.github.io/Manatee.Json/usage/path.html), [JSONPath-Plus](https://github.com/JSONPath-Plus/JSONPath)
- [YARRRML-Parser](https://github.com/RMLio/yarrrml-parser)
- [RMLMApper](https://github.com/RMLio/rmlmapper-java)

## Packages

```
"@dvuckovic/vue3-bootstrap-icons": "^1.0.4",
"@rmlio/rmlmapper-java-wrapper": "^2.0.3",    #wrapper for a RML-mapper implementation for the RDF mapping language (RML)
"@rmlio/yarrrml-parser": "^1.3.5",            #convert YARRRML rules to RML or R2RML rules
"ace-builds": "^1.4.13",                      #code editor
"axios": "^0.24.0",
"bootstrap": "^5.1.3",
"core-js": "^3.20.0",
"cors": "^2.8.5",                             #providing a Connect/Express middleware that can be used to enable CORS with various options
"express": "^4.17.2",                         #Fast, unopinionated, minimalist web framework
"jquery": "^3.6.0",                           #fast, small, and feature-rich JavaScript library
"js-yaml": "^4.1.0",                          #implementation of YAML
"n3": "^1.13.0",                              #The N3.js library is an implementation of the RDF.js low-level specification that lets you handle RDF in JavaScript easily. It offers: parsing, writing, storage
"sparql-http-client": "^2.4.0",
"splitpanes": "^3.0.6",
"underscore": "^1.13.2",                      #utility-belt library for JavaScript that provides support for the usual functional suspects (each, map, reduce, filter...) without extending any core JavaScript objects
"uuid": "^8.3.2",
"vue": "^3.2.26",
"vue-sweetalert2": "^5.0.2"                   #Good looking and easy to use modals
```
