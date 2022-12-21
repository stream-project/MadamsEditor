//import yarrrml from '@rmlio/yarrrml-parser/lib/rml-generator'
let yarrrml_lib = require('@rmlio/yarrrml-parser/lib/rml-generator');
import jsyaml from 'js-yaml';
const N3 = require('n3');
const crypto = require('crypto')

// import {insert} from './db-controller.js'
// load ace editor, themes and modes
import ace from 'ace-builds/src-min-noconflict/ace'
import 'ace-builds/src-min-noconflict/theme-tomorrow'
import 'ace-builds/src-min-noconflict/mode-yaml'
import 'ace-builds/src-min-noconflict/mode-turtle'
import 'ace-builds/src-min-noconflict/mode-json'
import "ace-builds/webpack-resolver";
// load workers from CDN, keeps our public/dist clean...
ace.config.set('workerPath', 'https://cdn.jsdelivr.net/npm/ace-builds@1.4.13/src-min-noconflict');

let _GLOBAL = {
    instance: null,
    config: {
        defaults: {
            data: {
                type: '', // string, value: url|json
                value: '', // string|json
                name: '' // string
            },
            mapping: {
                type: '', // string, value: url|yaml
                value: '', // string
                name: '' // string
            },
            rmlMapperUrl: '',
            // callback
            run: function() {}
        }
    },
    prefixes: {
        as: "https://www.w3.org/ns/activitystreams#",
        dqv: "http://www.w3.org/ns/dqv#",
        duv: "https://www.w3.org/TR/vocab-duv#",
        cat: "http://www.w3.org/ns/dcat#",
        qb: "http://purl.org/linked-data/cube#",
        grddl: "http://www.w3.org/2003/g/data-view#",
        ldp: "http://www.w3.org/ns/ldp#",
        oa: "http://www.w3.org/ns/oa#",
        ma: "http://www.w3.org/ns/ma-ont#",
        owl: "http://www.w3.org/2002/07/owl#",
        rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        rdfa: "http://www.w3.org/ns/rdfa#",
        rdfs: "http://www.w3.org/2000/01/rdf-schema#",
        rif: "http://www.w3.org/2007/rif#",
        rr: "http://www.w3.org/ns/r2rml#",
        skos: "http://www.w3.org/2004/02/skos/core#",
        skosxl: "http://www.w3.org/2008/05/skos-xl#",
        wdr: "http://www.w3.org/2007/05/powder#",
        void: "http://rdfs.org/ns/void#",
        wdrs: "http://www.w3.org/2007/05/powder-s#",
        xhv: "http://www.w3.org/1999/xhtml/vocab#",
        xml: "http://www.w3.org/XML/1998/namespace",
        xsd: "http://www.w3.org/2001/XMLSchema#",
        prov: "http://www.w3.org/ns/prov#",
        sd: "http://www.w3.org/ns/sparql-service-description#",
        org: "http://www.w3.org/ns/org#",
        gldp: "http://www.w3.org/ns/people#",
        cnt: "http://www.w3.org/2008/content#",
        dcat: "http://www.w3.org/ns/dcat#",
        earl: "http://www.w3.org/ns/earl#",
        ht: "http://www.w3.org/2006/http#",
        ptr: "http://www.w3.org/2009/pointers#",
        cc: "http://creativecommons.org/ns#",
        ctag: "http://commontag.org/ns#",
        dc: "http://purl.org/dc/terms/",
        dc11: "http://purl.org/dc/elements/1.1/",
        dcterms: "http://purl.org/dc/terms/",
        foaf: "http://xmlns.com/foaf/0.1/",
        gr: "http://purl.org/goodrelations/v1#",
        ical: "http://www.w3.org/2002/12/cal/icaltzd#",
        og: "http://ogp.me/ns#",
        rev: "http://purl.org/stuff/rev#",
        sioc: "http://rdfs.org/sioc/ns#",
        v: "http://rdf.data-vocabulary.org/#",
        vcard: "http://www.w3.org/2006/vcard/ns#",
        schema: "http://schema.org/",
        describedby: "http://www.w3.org/2007/05/powder-s#describedby",
        license: "http://www.w3.org/1999/xhtml/vocab#license",
        role: "http://www.w3.org/1999/xhtml/vocab#role",
        ssn: "http://www.w3.org/ns/ssn/",
        sosa: "http://www.w3.org/ns/sosa/",
        time: "http://www.w3.org/2006/time#"
    }
};

export default class MadamsEditor {

    constructor(options = {}) {
        if (_GLOBAL.instance) {
            return _GLOBAL.instance;
        }

        this.config = Object.assign({},
            _GLOBAL.config,
            _GLOBAL.config.defaults,
            options,
            {data: Object.assign({}, _GLOBAL.config.defaults.data, typeof options.data !== 'undefined' ? options.data : {})},
            {mapping: Object.assign({}, _GLOBAL.config.defaults.mapping, typeof options.mapping !== 'undefined' ? options.mapping : {})}
            );

        console.log('Welcome to MadamsEditor. Config:', this.config);

        this.ui = new MadamsEditor_UI();
        this.parser = new MadamsEditor_Parser();

        this.ui.init(this);
        this.parser.init(this);
        _GLOBAL.instance = this;
    }
}

class MadamsEditor_UI {

    init(parent) {
        this.config = parent.config;
        this.parser = parent.parser;
        const self = this;

        this.initEditors();

        // init run btn event
        document.querySelector("#convert-btn").addEventListener("click", (e) => {
            this.handleClickRunBtn(e);
            e.preventDefault();
        })

        // init save-rml btn event
        document.querySelector("#save-rml-btn").addEventListener("click", (e) => {
            this.handleClickSaveRmlBtn(e);
            
            // TEST CODE FOR RML -> YARRRML covertion. To be removed lates

            // const rml = `@prefix ns2: <http://semweb.mmlab.be/ns/rml#> .
            // @prefix ns3: <http://www.w3.org/ns/csvw#> .
            // @prefix ns4: <http://www.w3.org/ns/r2rml#> .
            // @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
            // @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
            // @prefix void: <http://rdfs.org/ns/void#> .
            
            // <http://mapping.example.com/rules_000> a void:Dataset ;
            //     void:exampleResource <http://mapping.example.com/map_cp_000>,
            //         <http://mapping.example.com/map_distribution_000>,
            //         <http://mapping.example.com/map_test_000> .
            
            // <http://mapping.example.com/csvw-dialect_000> a ns3:Dialect ;
            //     ns3:delimiter ";" .
            
            // <http://mapping.example.com/csvw_000> a ns3:Table ;
            //     ns3:dialect <http://mapping.example.com/csvw-dialect_000> ;
            //     ns3:url "data.file" .
            
            // <http://mapping.example.com/map_test_000> a ns4:TriplesMap ;
            //     rdfs:label "test" ;
            //     ns2:logicalSource <http://mapping.example.com/source_000> ;
            //     ns4:predicateObjectMap <http://mapping.example.com/pom_000>,
            //         <http://mapping.example.com/pom_001>,
            //         <http://mapping.example.com/pom_002>,
            //         <http://mapping.example.com/pom_003>,
            //         <http://mapping.example.com/pom_004>,
            //         <http://mapping.example.com/pom_005>,
            //         <http://mapping.example.com/pom_006>,
            //         <http://mapping.example.com/pom_007> ;
            //     ns4:subjectMap <http://mapping.example.com/s_000> .
            
            // <http://mapping.example.com/om_000> a ns4:ObjectMap ;
            //     ns4:constant "http://www.w3.org/ns/dcat#Dataset" ;
            //     ns4:termType ns4:IRI .
            
            // <http://mapping.example.com/om_001> a ns4:ObjectMap ;
            //     ns4:template "STREAM_{Object ID tensile test specimen}" ;
            //     ns4:termType ns4:Literal .
            
            // <http://mapping.example.com/om_002> a ns4:ObjectMap ;
            //     ns4:parentTriplesMap <http://mapping.example.com/map_distribution_000> .
            
            // <http://mapping.example.com/om_003> a ns4:ObjectMap ;
            //     ns4:template "{Object ID tensile test specimen} {Excel sheet name Messdaten} von {Material name} mit {Name optical strain measurement system}" ;
            //     ns4:termType ns4:Literal .
            
            // <http://mapping.example.com/om_004> a ns4:ObjectMap ;
            //     ns4:parentTriplesMap <http://mapping.example.com/map_cp_000> .
            
            // <http://mapping.example.com/om_005> a ns4:ObjectMap ;
            //     ns4:constant "http://id.loc.gov/vocabulary/iso639-1/en" ;
            //     ns4:termType ns4:Literal .
            
            // <http://mapping.example.com/om_006> a ns4:ObjectMap ;
            //     ns4:constant "https://creativecommons.org/licenses/by-nc-nd/4.0/" ;
            //     ns4:termType ns4:Literal .
            
            // <http://mapping.example.com/om_007> a ns4:ObjectMap ;
            //     ns4:constant "http://dsms.stream-dataspace.net/" ;
            //     ns4:termType ns4:Literal .
            
            // <http://mapping.example.com/om_008> a ns4:ObjectMap ;
            //     ns4:constant "http://www.w3.org/ns/dcat#Distribution" ;
            //     ns4:termType ns4:IRI .
            
            // <http://mapping.example.com/om_009> a ns4:ObjectMap ;
            //     ns4:template "STREAM_{Object ID tensile test specimen}" ;
            //     ns4:termType ns4:Literal .
            
            // <http://mapping.example.com/om_010> a ns4:ObjectMap ;
            //     ns2:reference "URL xls file raw data" ;
            //     ns4:termType ns4:Literal .
            
            // <http://mapping.example.com/om_011> a ns4:ObjectMap ;
            //     ns4:constant "https://www.iana.org/assignments/media-types/application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ;
            //     ns4:termType ns4:Literal .
            
            // <http://mapping.example.com/om_012> a ns4:ObjectMap ;
            //     ns4:constant "Weber" ;
            //     ns4:termType ns4:Literal .
            
            // <http://mapping.example.com/om_013> a ns4:ObjectMap ;
            //     ns4:constant "Matthias" ;
            //     ns4:termType ns4:Literal .
            
            // <http://mapping.example.com/om_014> a ns4:ObjectMap ;
            //     ns4:constant "mailto:matthias.weber@iwm.fraunhofer.de" ;
            //     ns4:termType ns4:Literal .
            
            // <http://mapping.example.com/om_015> a ns4:ObjectMap ;
            //     ns4:constant "https://www.iwm.fraunhofer.de" ;
            //     ns4:termType ns4:Literal .
            
            // <http://mapping.example.com/om_016> a ns4:ObjectMap ;
            //     ns4:constant "wbr" ;
            //     ns4:termType ns4:Literal .
            
            // <http://mapping.example.com/pm_000> a ns4:PredicateMap ;
            //     ns4:constant rdf:type .
            
            // <http://mapping.example.com/pm_001> a ns4:PredicateMap ;
            //     ns4:constant <http://purl.org/dc/terms/title> .
            
            // <http://mapping.example.com/pm_002> a ns4:PredicateMap ;
            //     ns4:constant <http://www.w3.org/ns/dcat#distribution> .
            
            // <http://mapping.example.com/pm_003> a ns4:PredicateMap ;
            //     ns4:constant <http://purl.org/dc/terms/description> .
            
            // <http://mapping.example.com/pm_004> a ns4:PredicateMap ;
            //     ns4:constant <http://www.w3.org/ns/dcat#contactPoint> .
            
            // <http://mapping.example.com/pm_005> a ns4:PredicateMap ;
            //     ns4:constant <http://purl.org/dc/terms/language> .
            
            // <http://mapping.example.com/pm_006> a ns4:PredicateMap ;
            //     ns4:constant <http://purl.org/dc/terms/license> .
            
            // <http://mapping.example.com/pm_007> a ns4:PredicateMap ;
            //     ns4:constant <http://www.w3.org/ns/dcat#landingPage> .
            
            // <http://mapping.example.com/pm_008> a ns4:PredicateMap ;
            //     ns4:constant rdf:type .
            
            // <http://mapping.example.com/pm_009> a ns4:PredicateMap ;
            //     ns4:constant <http://purl.org/dc/terms/title> .
            
            // <http://mapping.example.com/pm_010> a ns4:PredicateMap ;
            //     ns4:constant <http://www.w3.org/ns/dcat#downloadURL> .
            
            // <http://mapping.example.com/pm_011> a ns4:PredicateMap ;
            //     ns4:constant <http://www.w3.org/ns/dcat#mediaType> .
            
            // <http://mapping.example.com/pm_012> a ns4:PredicateMap ;
            //     ns4:constant <http://www.w3.org/2006/vcard/ns#family-name> .
            
            // <http://mapping.example.com/pm_013> a ns4:PredicateMap ;
            //     ns4:constant <http://www.w3.org/2006/vcard/ns#given-name> .
            
            // <http://mapping.example.com/pm_014> a ns4:PredicateMap ;
            //     ns4:constant <http://www.w3.org/2006/vcard/ns#hasEmail> .
            
            // <http://mapping.example.com/pm_015> a ns4:PredicateMap ;
            //     ns4:constant <http://www.w3.org/2006/vcard/ns#hasOrganizationName> .
            
            // <http://mapping.example.com/pm_016> a ns4:PredicateMap ;
            //     ns4:constant <http://www.w3.org/2006/vcard/ns#nickname> .
            
            // <http://mapping.example.com/pom_000> a ns4:PredicateObjectMap ;
            //     ns4:objectMap <http://mapping.example.com/om_000> ;
            //     ns4:predicateMap <http://mapping.example.com/pm_000> .
            
            // <http://mapping.example.com/pom_001> a ns4:PredicateObjectMap ;
            //     ns4:objectMap <http://mapping.example.com/om_001> ;
            //     ns4:predicateMap <http://mapping.example.com/pm_001> .
            
            // <http://mapping.example.com/pom_002> a ns4:PredicateObjectMap ;
            //     ns4:objectMap <http://mapping.example.com/om_002> ;
            //     ns4:predicateMap <http://mapping.example.com/pm_002> .
            
            // <http://mapping.example.com/pom_003> a ns4:PredicateObjectMap ;
            //     ns4:objectMap <http://mapping.example.com/om_003> ;
            //     ns4:predicateMap <http://mapping.example.com/pm_003> .
            
            // <http://mapping.example.com/pom_004> a ns4:PredicateObjectMap ;
            //     ns4:objectMap <http://mapping.example.com/om_004> ;
            //     ns4:predicateMap <http://mapping.example.com/pm_004> .
            
            // <http://mapping.example.com/pom_005> a ns4:PredicateObjectMap ;
            //     ns4:objectMap <http://mapping.example.com/om_005> ;
            //     ns4:predicateMap <http://mapping.example.com/pm_005> .
            
            // <http://mapping.example.com/pom_006> a ns4:PredicateObjectMap ;
            //     ns4:objectMap <http://mapping.example.com/om_006> ;
            //     ns4:predicateMap <http://mapping.example.com/pm_006> .
            
            // <http://mapping.example.com/pom_007> a ns4:PredicateObjectMap ;
            //     ns4:objectMap <http://mapping.example.com/om_007> ;
            //     ns4:predicateMap <http://mapping.example.com/pm_007> .
            
            // <http://mapping.example.com/pom_008> a ns4:PredicateObjectMap ;
            //     ns4:objectMap <http://mapping.example.com/om_008> ;
            //     ns4:predicateMap <http://mapping.example.com/pm_008> .
            
            // <http://mapping.example.com/pom_009> a ns4:PredicateObjectMap ;
            //     ns4:objectMap <http://mapping.example.com/om_009> ;
            //     ns4:predicateMap <http://mapping.example.com/pm_009> .
            
            // <http://mapping.example.com/pom_010> a ns4:PredicateObjectMap ;
            //     ns4:objectMap <http://mapping.example.com/om_010> ;
            //     ns4:predicateMap <http://mapping.example.com/pm_010> .
            
            // <http://mapping.example.com/pom_011> a ns4:PredicateObjectMap ;
            //     ns4:objectMap <http://mapping.example.com/om_011> ;
            //     ns4:predicateMap <http://mapping.example.com/pm_011> .
            
            // <http://mapping.example.com/pom_012> a ns4:PredicateObjectMap ;
            //     ns4:objectMap <http://mapping.example.com/om_012> ;
            //     ns4:predicateMap <http://mapping.example.com/pm_012> .
            
            // <http://mapping.example.com/pom_013> a ns4:PredicateObjectMap ;
            //     ns4:objectMap <http://mapping.example.com/om_013> ;
            //     ns4:predicateMap <http://mapping.example.com/pm_013> .
            
            // <http://mapping.example.com/pom_014> a ns4:PredicateObjectMap ;
            //     ns4:objectMap <http://mapping.example.com/om_014> ;
            //     ns4:predicateMap <http://mapping.example.com/pm_014> .
            
            // <http://mapping.example.com/pom_015> a ns4:PredicateObjectMap ;
            //     ns4:objectMap <http://mapping.example.com/om_015> ;
            //     ns4:predicateMap <http://mapping.example.com/pm_015> .
            
            // <http://mapping.example.com/pom_016> a ns4:PredicateObjectMap ;
            //     ns4:objectMap <http://mapping.example.com/om_016> ;
            //     ns4:predicateMap <http://mapping.example.com/pm_016> .
            
            // <http://mapping.example.com/s_000> a ns4:SubjectMap ;
            //     ns4:template "https://dsms.stream-dataspace.net/datasets/{Object ID tensile test specimen}" .
            
            // <http://mapping.example.com/s_001> a ns4:SubjectMap ;
            //     ns4:template "https://www.simphony-project.eu/entity#{Value Youngs Modulus E}" .
            
            // <http://mapping.example.com/s_002> a ns4:SubjectMap ;
            //     ns4:constant "https://www.simphony-project.eu/entity#3a516b9d-38a9-4f1a-800f-0db8ccb9d0c0" .
            
            // <http://mapping.example.com/map_cp_000> a ns4:TriplesMap ;
            //     rdfs:label "cp" ;
            //     ns2:logicalSource <http://mapping.example.com/source_000> ;
            //     ns4:predicateObjectMap <http://mapping.example.com/pom_012>,
            //         <http://mapping.example.com/pom_013>,
            //         <http://mapping.example.com/pom_014>,
            //         <http://mapping.example.com/pom_015>,
            //         <http://mapping.example.com/pom_016> ;
            //     ns4:subjectMap <http://mapping.example.com/s_002> .
            
            // <http://mapping.example.com/map_distribution_000> a ns4:TriplesMap ;
            //     rdfs:label "distribution" ;
            //     ns2:logicalSource <http://mapping.example.com/source_000> ;
            //     ns4:predicateObjectMap <http://mapping.example.com/pom_008>,
            //         <http://mapping.example.com/pom_009>,
            //         <http://mapping.example.com/pom_010>,
            //         <http://mapping.example.com/pom_011> ;
            //     ns4:subjectMap <http://mapping.example.com/s_001> .
            
            // <http://mapping.example.com/source_000> a ns2:LogicalSource ;
            //     rdfs:label "file" ;
            //     ns2:iterator """
            // """ ;
            //     ns2:referenceFormulation <http://semweb.mmlab.be/ns/ql#CSV> ;
            //     ns2:source <http://mapping.example.com/csvw_000> .
            // `
            // const toYARRRML = require('@rmlio/yarrrml-parser/lib/yarrrml-generator.js');

            // const parser = new N3.Parser();
            // const quads = [];

            // parser.parse(rml, (err, quad, prefixes) => {
            // if (quad) {
            //     quads.push(quad);
            // } else {
            //     toYARRRML(quads, prefixes).then(str => {
            //     //   const output = fs.readFileSync(path.resolve(__dirname, '../test/rml2yarrrml_1/mappings.yarrrml'), 'utf8');
            //     console.log(str)

            //     return str;
            //     });
            // }
            // });

            e.preventDefault();
        })

        // ctrl+enter shortcut
        document.addEventListener('keydown', (e) => {
            if (e.code == 'Enter' && e.ctrlKey) {
                self.handleClickRunBtn();
            }
        });

        // close status bar
        // document.querySelector("#statusBar-buttons .close").addEventListener("click", e => {
        //     this.closeStatusBar();
        //     e.preventDefault();
        // })
    }

    initEditors() {
        const self = this;
        const data = this.config.data;
        const mapping = this.config.mapping;

        // init data editor
        this.dataEditor = ace.edit("data-editor" ,{
            mode: "ace/mode/text",
            theme: "ace/theme/tomorrow",
        });

        // init mapping editor
        this.mappingEditor = ace.edit("mapping-editor", {
            mode: "ace/mode/yaml",
            theme: "ace/theme/tomorrow",
            tabSize: 2,
        });
        this.mappingEditor.focus();
        this.mappingEditor.session.on("change", () => {
            self.handleUpdateYarrmlEditor();
        });

        // init rml teditor
        this.rmlEditor = ace.edit("rml-viewer", {
            mode: "ace/mode/turtle",
            theme: "ace/theme/tomorrow",
        });

        // init out teditor
        this.outEditor = ace.edit("out-editor", {
            mode: "ace/mode/turtle",
            theme: "ace/theme/tomorrow",
        });

        // load initial data
        if (!data.type) {
            // do nothing
        }
        else if (data.type == 'json') {
            this.editorSetValue(this.dataEditor, JSON.stringify(data.value, null, '\t'));
        }
        else if (data.type == 'url') {
            this.loadData(data.value, this.dataEditor)
            if (!data.name || data.name == "") {
                data.name = data.value.substring(data.value.lastIndexOf('/')+1);
            }
        }
        else {
            this.addMessage('error', `Undefined data type "${data.type}"`)
        }
        if (data.name && data.name != "") {
            document.querySelector('#data-filename').textContent = data.name;
        }

        // load initial mapping
        if (!mapping.type) {
            // do nothing
        }
        else if (mapping.type == 'yaml') {
            this.editorSetValue(this.mappingEditor, mapping.value);
        }
        else if (mapping.type == 'url') {
            this.loadData(mapping.value, this.mappingEditor)
            if (!mapping.name || mapping.name == "") {
                mapping.name = mapping.value.substring(mapping.value.lastIndexOf('/')+1);
            }
        }
        else {
            this.addMessage('error', `Undefined mapping type "${mapping.type}"`)
        }
        if (mapping.name && mapping.name != "") {
            document.querySelector('#mapping-filename').textContent = mapping.name;
        }

        // fix remove initial col/h-50 style to enable resizeable
        document.querySelector("#leftCol").classList.remove('col');
        document.querySelector("#rightCol").classList.remove('col');
        document.querySelector("#mapping-wrapper").classList.remove('h-50');
        document.querySelector("#data-wrapper").classList.remove('h-50');
    }

    handleClickSaveRmlBtn() { 
        let rml = this.rmlEditor.getValue().trim()
        if(rml != ""){
            let obj = new Object();
            obj.id = crypto.createHash('sha1').update(rml).digest('hex');
            obj.lines  = rml;
            fetch(process.env.VUE_APP_PYTHON_BACKEND + "/addrmlfile", {
                method: "POST",
                // mode: 'no-cors',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(obj)
            })
            .then(res => {
                if(res.status == 200){
                    this.addMessage('success', 'RML saved with id: ' + obj.id);
                }
                else if(res.status == 409){
                    this.addMessage('error', 'RML fle already exists with id: ' + obj.id);
                }
                else if(res.status == 422){
                    this.addMessage('error', 'Upload failed: RML fle not accepted!');
                }
            })
            .catch(e => {
                this.addMessage('error', 'RML Save failed: ' + e);
            })
        } 

    }

    handleClickRunBtn() {
        let result = false;
        const btn = document.querySelector("#convert-btn");
        btn.classList.add('disabled')
        btn.querySelector(".loader").classList.remove("d-none");
        btn.querySelector(".bi").classList.add("d-none");

        clearTimeout(this.currentYarrrmlValidationTimout)

        this.parser.runMapping()
        .then(res => {
            return this.parser.rdf2Turtle(res)
        })
        .then(res => {
            result = res.replace(/\.\n([\w<])/g, ".\n\n$1");
            this.editorSetValue(this.outEditor, result)
            this.addMessage('success', 'RML mapping OK')
        })
        .catch(e => {
            this.addMessage('error', 'RML Mapper failed: ' + e);
        })
        .finally(() => {
            btn.classList.remove('disabled')
            btn.querySelector(".loader").classList.add("d-none");
            btn.querySelector(".bi").classList.remove("d-none");
            this.mappingEditor.focus(); // TODO set to last focus
            // call callback function
            this.config.run.call(
                this,
                result ? this.parser.getYarrrml() : false,
                result ? result : false
            );
        })
    }

    handleUpdateYarrmlEditor() {
        const self = this;
        this.currentYarrrmlValidationTimout = null;

        let mappingStr = this.mappingEditor.getValue();
        clearTimeout(this.currentYarrrmlValidationTimout);
        this.mappingEditor.getSession().setAnnotations([])

        // validate yaml
        try {
            jsyaml.load(mappingStr)
        } catch (error) {
            this.mappingEditor.getSession().setAnnotations([{
                row: error.mark.line,
                column: error.mark.column,
                text: error.reason,
                type: 'error'
            }])
            return
        }

        // validate yarrrml to rml
        this.currentYarrrmlValidationTimout = setTimeout(() => {
            mappingStr = self.parser.yarrrmlExtend(mappingStr);
            mappingStr = self.parser.yarrrmlEncodeBrackets(mappingStr);

            self.parser.yarrrml2RML(mappingStr)
            .then(rml => {
              console.log('RML:', rml);
              this.editorSetValue(this.rmlEditor, rml)
            })
            .catch(e => {
                self.addMessage('error', e);
            })
        }, 1500)
    }

    loadData(url = "", target = null) {
        if (url == "" ) {
            return new Promise((resolve) => { resolve(true) });
        }
        return new Promise((resolve, reject) => {
            fetch(url)
            .then(data => {
                if (!data.ok) {
                    throw new Error('Network response was not ok');
                }
                return data.text()
            })
            .then(text => {
                this.editorSetValue(target, text);
                resolve(true);
            })
            .catch(error => {
                this.addMessage('error', 'Fetch example data failed. ' + error)
                reject(error);
            });
        })
    }

    editorSetValue(target = null, text = '') {
        if (!target) return;
        target.setValue(text);
        target.clearSelection();
    }

    addMessage(type, ...message) {
        const alert = document.createElement("div");
        alert.className = "alert";
        alert.textContent = message.toString();

        switch (type) {
            case 'error':
                alert.classList.add('alert-danger');
                break;
            case 'success':
                alert.classList.add('alert-success');
                break;
            case 'info':
                alert.classList.add('alert-info');
                break;
            case 'warning':
                alert.classList.add('alert-warning');
                break;
            default:
                break;
        }
        document.querySelector("#messages-wrapper").innerHTML = alert.outerHTML;

        if (document.querySelector("#statusBar").classList.contains("invisible")) {
            this.openStatusBar();
        }
        console.log(type, message);
    }

    openStatusBar() {
        // TODO: may resizeable status bar: https://jsfiddle.net/ve5dhp0L/
        document.querySelector("#statusBar").classList.remove("invisible");
        document.querySelectorAll("#leftCol, .gutter-horizontal, #rightCol").forEach(el => {
            el.style.height = "calc(100% - 24px)";
        })
        this.mappingEditor.resize();
        this.dataEditor.resize();
        this.outEditor.resize();
    }

    closeStatusBar() {
        document.querySelector("#statusBar").classList.add("invisible");
        document.querySelectorAll("#leftCol, .gutter-horizontal, #rightCol").forEach(el => {
            el.style.height = "";
        })
        this.mappingEditor.resize();
        this.dataEditor.resize();
        this.outEditor.resize();
    }
}

class MadamsEditor_Parser {
    constructor() {
      this.escapeTable = {
          '(': '\\$LBR',
          ')': '\\$RBR',
          '{': '\\$LCB',
          '}': '\\$RCB',
        };
    }

    init(parent) {
        this.config = parent.config;
        this.ui = parent.ui;
    }

    runMapping() {
        const self = this;
        const inputData = this.ui.dataEditor.getValue();
        const mappingStr = this.getYarrrml();

        return new Promise((resolve, reject) => {
            this.yarrrml2RML(mappingStr)
            .then(rml => {
                const sources = {};
                sources[self.config.data.name] = inputData;
                return fetch(self.config.rmlMapperUrl, {
                    method: "POST",
                    // mode: 'no-cors',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ rml, sources })
                });
            })
            .then(response => {
                //console.log(response)
                if (!response.ok) {
                    return response.text().then(e => {
                        e = JSON.parse(e);
                        if (e.error)
                            throw new Error(e.error);
                        else
                            throw new Error('Something went wrong');
                    })
                }
                return response.text()
            })
            .then(data => {
                data = self.decodeRMLReplacements(data);
                resolve(data);
            })
            .catch(e => {
                console.log(e);
                reject(e.toString())
            })

        })
    }

    getYarrrml() {
        let mappingStr = this.ui.mappingEditor.getValue();
        mappingStr = this.yarrrmlExtend(mappingStr);
        mappingStr = this.yarrrmlEncodeBrackets(mappingStr);
        return mappingStr;
    }

    yarrrmlExtend(yarrrml) {
        // replace function
        let str = yarrrml.replace(
            /((?:parameters|pms): *\[)([\w@^./$()"' ,[\]|=:]+)(\])/g,
            (...e) => {
            const [, cg1, cg2, cg3] = e;
            const params = cg2
                .split(',')
                .map((el, i) => `[schema:str${i}, ${el.trim()}]`)
                .join(', ');
            return cg1 + params + cg3;
            },
        );
        // replace join
        str = str.replace(
            /join: *\[ *"?([\w@^./$:\-*, ')()]+)"? *, *"?([\w@^./$:\-*, '()]+)"? *\]/g,
            'condition:{function:equal,parameters:[[str1,"$($1)"],[str2,"$($2)"]]}',
        );
        return str;
    }

    yarrrmlEncodeBrackets (str) {
        let level = 0;
        let ret = '';

        for (let i = 0; i < str.length; i += 1) {
          const c = str[i];

          if (level < 0) {
            throw new Error('failed parsing brackets');
          }

          if (level === 0) {
            switch (c) {
              case '$':
                if (str[i + 1] === '(') {
                  level += 1;
                  i += 1;
                  ret += '$(';
                } else {
                  ret += c;
                }
                break;
              case '(':
              case ')':
              default:
                ret += c;
            }
          } else {
            switch (c) {
              case '(':
                level += 1;
                ret += '$LBR';
                break;
              case ')':
                level -= 1;
                if (level === 0) {
                  ret += ')';
                } else {
                  ret += '$RBR';
                }
                break;
              default:
                ret += c;
            }
          }
        }
        return ret;
    }

    decodeRMLReplacements (rml) {
        return Object.entries(this.escapeTable).reduce(
            (str, [char, code]) => str.replace(new RegExp(code, 'g'), char),
            rml,
        );
    }

    yarrrml2RML(yaml) {
        const self = this;
        const y2r = new yarrrml_lib();
        const writer = new N3.Writer();
        let quads;
        try {
            quads = y2r.convert(yaml)
            if(typeof y2r.getMessages !== 'undefined') {
                const messages = y2r.getMessages()
                messages.forEach(message => {
                    self.ui.addMessage(message.type, message.text);
                });
            }
        } catch (e) {
            return Promise.reject('Generate the RML mapping from YARRRML failed. ' + e);
        }

        writer.addQuads(quads);
        return new Promise((resolve, reject) => {
            writer.end( (err,doc) => err ? reject(err) : resolve(doc));
        });
    }

    rdf2Turtle(rdf) {
        const parser = new N3.Parser();
        const outWriter = new N3.Writer({
            format: "turtle",
            prefixes: this.getUsedPrefixes()
        });
        let resultQuads = [];

        // manually sort, to have better turtel with rdf:type first
        const sortResultFn = (a, b) => {
            const isRdfType = a.subject.id == b.subject.id && a.predicate.id == _GLOBAL.prefixes.rdf + 'type';
            return isRdfType ? -1 : 0;
        }

        return new Promise((resolve, reject) => {
            parser.parse(rdf, (err, quad) => {
                if (err)
                    return reject('N3 parser error: ' + err);
                if (quad)
                    return resultQuads.push(quad);

                resultQuads.sort(sortResultFn);
                outWriter.addQuads(resultQuads);
                outWriter.end((err,outTtl)=>{
                    if (err) return reject('N3 parser error: ' + err);
                    resolve(outTtl);
                });
            })
        });
    }


    getUsedPrefixes() {
        const self = this;
        const yaml = this.ui.mappingEditor.getValue()
        let prefixes = {};
        prefixes.rdf = _GLOBAL.prefixes.rdf;
        Object.keys(_GLOBAL.prefixes).forEach(pre=>{
            if (yaml.indexOf(`${pre}:`) >= 0) {
                prefixes[pre] = _GLOBAL.prefixes[pre]
            }
        });
        try {
            let json = jsyaml.load(yaml, null, null, true);
            if (json.prefixes) {
                prefixes = Object.assign({}, prefixes, json.prefixes)
            }
        } catch (e) {
            self.ui.addMessage('error', e);
        }
        return prefixes
    }

}
