import api
import hashlib
import json
import re
import requests
import server
import storage
import time
import utils
import os



BASE_PATH="web/"
with open("web/play_template.html","rb") as f:
	GAME_TEMPLATE=f.read().split(b"\"$$$__DATA__$$$\"")



@server.route("GET",r"/")
def index(url):
	server.set_code(200)
	server.set_header("Content-Type","text/html")
	server.set_header("Cache-Control","public,max-age=31536000,immutable")
	return utils.cache("web/index.html")



@server.route("GET",r"/play/[a-fA-F0-9]{32}")
def play_token(url):
	server.set_header("Content-Type","text/html")
	tk=api.is_valid_login(url[6:])
	if (tk is not None):
		server.set_code(307)
		server.set_header("Set-cookie",f"__ctoken={tk};Max-Age={api.TOKEN_EXP_DATE};SameSite=Secure;Secure;HttpOnly;Path=/")
		server.set_header("Location","https://megimeru.herokuapp.com/play")
		return b""
	server.set_code(404)
	server.set_header("Content-Type","text/html")
	return utils.cache("web/not_found.html")



@server.route("GET",r"/play")
def play(url):
	tk=api.read_token()
	server.set_header("Content-Type","text/html")
	if (tk is None or not api.is_valid(tk)):
		server.set_code(307)
		server.set_header("Location","https://megimeru.herokuapp.com/")
		return b""
	server.set_code(200)
	dt=api.get_user_data(tk)
	return GAME_TEMPLATE[0]+bytes(f"{{name:\"{dt['nm']}\",level:{dt['lvl']}}}","utf-8")+GAME_TEMPLATE[1]



@server.route("GET",r"/rsrc/.*")
def rsrc(url):
	server.set_header("Content-Type","image/jpeg")
	if (os.path.exists(BASE_PATH+url)):
		server.set_code(200)
		return utils.cache(BASE_PATH+url)
	server.set_code(404)
	server.set_header("Content-Type","text/plain")
	return b"Not Found"



@server.route("GET",None)
def not_found(url):
	server.set_code(404)
	server.set_header("Content-Type","text/html")
	return utils.cache("web/not_found.html")
