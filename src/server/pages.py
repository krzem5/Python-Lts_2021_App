import api
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



@server.route("GET",r"/start/[a-fA-F0-9]{32}")
def start(url):
	server.set_header("Content-Type","text/html")
	tk=api.is_valid(url[7:])
	if (tk is not None):
		server.set_code(307)
		server.set_header("Set-cookie",f"__ctoken={tk};Max-Age={api.TOKEN_EXP_DATE};SameSite=Secure;Secure;HttpOnly;Path=/")
		server.set_header("Location","https://megimeru.herokuapp.com/start")
		return b""
	server.set_code(404)
	server.set_header("Content-Type","text/html")
	return utils.cache("web/not_found.html")



@server.route("GET",None)
def not_found(url):
	server.set_code(404)
	server.set_header("Content-Type","text/html")
	return utils.cache("web/not_found.html")
