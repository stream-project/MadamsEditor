from flask import Flask, request
import flask
from utils import addRmlFile, getRmlFile, getRmlFilePath, getRmlFileNames, deleteRmlFile
from flask_cors import CORS
from waitress import serve

app = Flask(__name__)
CORS(app)

@app.route("/")
def index():
    return "Hola"

@app.route("/getrmlfile", methods=['GET'] )
def getrmlfile():
    id = request.args.get("id")
    print(id)
    if(id.isalnum()):
        rml_file = getRmlFile(id)
        # app.logger.info(rml_file)
        resp = flask.Response(rml_file)
    else:
        resp = flask.Response("Missing Args")
    return resp


@app.route("/addrmlfile", methods=['POST'] )
def addrmlfile():
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json'):
        json = request.json
        id, lines = json['id'] , json['lines']
        if(getRmlFilePath(id) == "" and id.isalnum()):
            statusCode = addRmlFile(id, lines)
            if statusCode == 200:
                return json['id'], statusCode
            return 'Unprocessable Entity', 422
        else:
            return 'Duplicate record', 409
    else:
        return 'Content-Type not supported!', 415

@app.route("/getrmlfiles", methods=['GET'] )
def getRmlFiles():
    ids = getRmlFileNames()
    return ids, 200

@app.route("/deletermlfile", methods=['DELETE'] )
def deletermlfile():
    id = request.args.get("id")
    if(id.isalnum()):
        status_code = deleteRmlFile(id)
        if(status_code == 404):
            return 'RML file not found!', status_code
        elif(status_code == 200):
            return id, status_code
        else:
            'Something went wrong', 400


if __name__ == '__main__':
    serve(app, host ='0.0.0.0', port = 5001)
