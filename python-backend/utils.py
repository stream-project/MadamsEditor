from flask import Flask, wrappers, request
from multiprocessing import Pool
import json
import threading
import os, requests
import logging
import  asyncio

from dbConnect import getSPARQL

final_download_folder = os.path.abspath('result_files')

def getRmlFileNames():
    ids = [] 
    final_downloaded_files = os.listdir(final_download_folder)
    for downloaded_file in final_downloaded_files:
        if (downloaded_file.endswith(".rml")):
            ids.append(downloaded_file)
    return ids
 
def getRmlFile(requested_id):
    downloaded_file_path = getRmlFilePath(requested_id)
    if downloaded_file_path == "":
        return "File not found!"

    with open(downloaded_file_path,'r') as f:
        lines = f.read()
        f.close()
        return lines

def addRmlFile(id, lines):
    try:
        sparql = getSPARQL()
        query = "INSERT DATA { GRAPH <http://mapping.stream.com#" + id + "> { " + lines + " } } "
        sparql.setQuery(query)
        results = sparql.queryAndConvert()
        print (results)

        result_file_name = id + '.rml'
        result_file_path = os.path.join(final_download_folder, result_file_name)
        with open(result_file_path,'w') as result_file:
            result_file.writelines(lines)
        result_file.close()
        return(200)

    except Exception as e:
        print(e)
        return(422)

def deleteRmlFile(id):
    path = getRmlFilePath(id)
    if(path == ""):
        return(404)
    try:
        sparql = getSPARQL()
        query = "CLEAR GRAPH <http://mapping.stream.com#" + id + ">"
        sparql.setQuery(query)
        results = sparql.queryAndConvert()
        print (results)

        os.remove(path)
        return(200)

    except Exception as e:
        print(e)
        return(404)


def getRmlFilePath(requested_id):
    final_downloaded_files = os.listdir(final_download_folder)
    for downloaded_file in final_downloaded_files:
        if (downloaded_file.endswith(".rml")):
            id = downloaded_file.split('.')[0]
            if( id == requested_id):
                downloaded_file_path = os.path.join(final_download_folder, downloaded_file)
                return downloaded_file_path
    return ""
