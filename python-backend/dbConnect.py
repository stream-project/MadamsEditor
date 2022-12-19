from SPARQLWrapper import SPARQLWrapper, JSON, POST, DIGEST
import urllib

def getSPARQL():
    sparql = SPARQLWrapper("http://localhost:8890/sparql")
    sparql.setHTTPAuth(DIGEST)
    sparql.setCredentials("SPARQL", "pwd")
    sparql.setMethod(POST)
    sparql.setReturnFormat(JSON)
    return sparql