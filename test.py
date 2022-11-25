# import sparql
# s = sparql.Service('http://dba:DbaGraphPassword@localhost:1111', "utf-8", "GET")

from SPARQLWrapper import SPARQLWrapper, JSON, POST, DIGEST
sparql = SPARQLWrapper("http://localhost:8890/sparql")

sparql.setHTTPAuth(DIGEST)
sparql.setCredentials("dba", "DbaGraphPassword")
sparql.setMethod(POST)

sparql.setQuery("DESCRIBE <http://www.example.com/my-graph>")
results = sparql.query()
print (results.response.read())
#print(results.serialize(format="json-ld"))