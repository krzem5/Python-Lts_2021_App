import hashlib
import json
import re
import requests
import server
import storage
import time
import utils
import threading
import secrets



global ALL_USERS,USER_LOGIN_URLS
ALL_USERS={}
USER_LOGIN_URLS={}
EXP_START_TIME=300
JSON_TYPE_MAP={list:"array",str:"string",int:"int",float:"float",bool:"boolean"}
ID_LEN=16
URL_ID_LEN=16
TOKEN_EXP_DATE=31536000



_tl=threading.Lock()




def _validate(eb,t,body=False):
	b_dt=None
	if (body==True):
		try:
			b_dt=json.loads(server.body())
		except json.JSONDecodeError as e:
			traceback.print_exception(None,e,e.__traceback__)
			server.set_code(400)
			server.set_header("Content-Type","application/json")
			return ({"error":{"code":"E_JSON","message":"Unable to Deserialize JSON"}},False)
	q=server.queries()
	o={}
	for k,v in t.items():
		if (v["p"]=="body"):
			if (k not in b_dt and "d" not in v):
				server.set_code(400)
				server.set_header("Content-Type","application/json")
				return ({"error":{"code":f"E_{eb.upper()}_FIELD","message":f"Required Field '{k}' is Missing from Request Body"}},False)
			o[k]=(b_dt[k] if k in b_dt else v["d"])
			if (type(o[k])!=v["t"]):
				server.set_code(400)
				server.set_header("Content-Type","application/json")
				return ({"error":{"code":f"E_{eb.upper()}_FIELD_TYPE","message":f"Field '{k}' should have '{JSON_TYPE_MAP.get(v['t'],'object')}' type, but has '{JSON_TYPE_MAP.get(type(o[k]),'object')}' type"}},False)
			if ("range" in v):
				if (o[k]<v["range"][0] or o[k]>v["range"][1]):
					server.set_code(400)
					server.set_header("Content-Type","application/json")
					return ({"error":{"code":f"E_{eb.upper()}_FIELD_RANGE","message":f"Field '{k}' should be between '{v['range'][0]}' and '{v['range'][1]}', but has a value of '{o[k]}'"}},False)
		elif (v["p"]=="query"):
			if (k not in q and "d" not in v):
				server.set_code(400)
				server.set_header("Content-Type","application/json")
				return ({"error":{"code":f"E_{eb.upper()}_FIELD","message":f"Required Field '{k}' is Missing from Request Query"}},False)
			o[k]=(q[k] if k in q else v["d"])
			try:
				o[k]=v["t"](o[k])
			except:
				server.set_code(400)
				server.set_header("Content-Type","application/json")
				return ({"error":{"code":f"E_{eb.upper()}_FIELD_TYPE","message":f"Field '{k}' should have '{JSON_TYPE_MAP.get(v['t'],'object')}' type, but has '{JSON_TYPE_MAP.get(type(o[k]),'object')}' type"}},False)
			if ("range" in v):
				if (o[k]<v["range"][0] or o[k]>v["range"][1]):
					server.set_code(400)
					server.set_header("Content-Type","application/json")
					return ({"error":{"code":f"E_{eb.upper()}_FIELD_RANGE","message":f"Field '{k}' should be between '{v['range'][0]}' and '{v['range'][1]}', but has a value of '{o[k]}'"}},False)
		else:
			raise RuntimeError(v["p"])
	return (o,True)



def is_valid_login(t):
	global USER_LOGIN_URLS
	_tl.acquire()
	if (t in USER_LOGIN_URLS and USER_LOGIN_URLS[t][1]>time.time()):
		o=USER_LOGIN_URLS[t][0]
		del USER_LOGIN_URLS[t]
		_tl.release()
		return o
	_tl.release()
	return None



def is_valid(t):
	_tl.acquire()
	o=(t in ALL_USERS)
	_tl.release()
	return o



def read_token():
	h=server.headers()
	tk=None
	if ("cookie" in h):
		for k in h["cookie"].split(b";"):
			k=k.split(b"=")
			if (k[0]==b"__ctoken"):
				return str(k[1],"utf-8")
	return None



@server.route("POST",r"/api/create")
def api_create(url):
	global ALL_USERS,USER_LOGIN_URLS
	dt,ok=_validate("create",{"name":{"t":str,"p":"body"},"level":{"t":int,"p":"body","range":[0,2]}},body=True)
	if (ok==False):
		return dt
	server.set_code(200)
	server.set_header("Content-Type","application/json")
	_tl.acquire()
	id_=secrets.token_hex(ID_LEN)
	while (id_=="0"*ID_LEN*2 or id_ in ALL_USERS):
		id_=secrets.token_hex(ID_LEN)
	ALL_USERS[id_]={"nm":dt["name"],"lvl":dt["level"]}
	l_id=secrets.token_hex(URL_ID_LEN)
	while (l_id in USER_LOGIN_URLS):
		l_id=secrets.token_hex(URL_ID_LEN)
	USER_LOGIN_URLS[l_id]=(id_,int(time.time())+EXP_START_TIME)
	_tl.release()
	return {"url":f"/start/{l_id}"}
