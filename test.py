from SPARQLWrapper import SPARQLWrapper, JSON, POST, DIGEST, XML, RDF
import urllib
sparql = SPARQLWrapper("http://localhost:8890/sparql")

sparql.setHTTPAuth(DIGEST)
sparql.setCredentials("SPARQL", "pwd")
sparql.setMethod(POST)
# sparql.setReturnFormat(RDF)

with open("mn_rml.rml", "r") as f:
    lines = f.read()
# query = "select distinct * where { graph <http://localhost:8890/dummy> {?s ?p ?o .}  }"
query= "CONSTRUCT { ?s ?p ?o . } FROM <http://mapping.stream.com#feecd2c0bc7d7727f169f702019904cc25c5e5dd> WHERE {  ?s ?p ?o . }"

sparql.setQuery(query)
results = sparql.queryAndConvert()
# results = sparql.query()
#print(results)
print(results.serialize()) 