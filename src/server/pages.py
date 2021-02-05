import hashlib
import json
import re
import requests
import server
import storage
import time
import utils



@server.route("GET",r"/")
def index(url):
	server.set_code(200)
	server.set_header("Content-Type","text/html")
	server.set_header("Cache-Control","public,max-age=31536000,immutable")
	return utils.cache("web/index.html")



@server.route("*",None)
def not_found(url):
	server.set_code(404)
	server.set_header("Content-Type","text/html")
	return utils.cache("web/not_found.html")
