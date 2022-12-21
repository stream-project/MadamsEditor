from SPARQLWrapper import SPARQLWrapper, JSON, POST, DIGEST
import os

def getSPARQL():
    user =  os.environ.get('USERNAME') if os.environ.get('USERNAME') else ''
    password = os.environ.get('PASSWORD') if os.environ.get('PASSWORD') else ''
    sparql_url = os.environ.get('VIRTUOSO_SPARQL') if os.environ.get('VIRTUOSO_SPARQL') else 'http://localhost:8890/sparql'
    sparql = SPARQLWrapper(sparql_url)
    sparql.setHTTPAuth(DIGEST)
    sparql.setCredentials(user, password)
    sparql.setMethod(POST)
    sparql.setReturnFormat(JSON)
    return sparql