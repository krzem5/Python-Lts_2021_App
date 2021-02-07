import builtins
import datetime
import inspect
import threading
import time



global _c,_pq,_sc
_c={}
_pq=None
_sc=None
_tl=threading.Lock()



def _print_q():
	global _pq
	lt=time.time()
	fs=__import__("storage")
	fs.set_silent("log.log")
	dt=fs.read("log.log")
	lc=dt.count(b"\n")
	while (True):
		if (len(_pq)>0):
			_tl.acquire()
			a,sf,_pq=" ".join([str(e) for e in _pq[0][0]]),_pq[0][1],_pq[1:]
			_tl.release()
			s=datetime.datetime.now().strftime(f"[{sf.filename[:-3]}{('.'+sf.function if sf.function!='<module>' else '')}, %H:%M:%S] {a}")
			builtins.print(s)
			dt+=bytes(s,"utf-8")+b"\n"
			lc+=1
			if (lc>1024):
				dt=dt[dt.index(b"\n")+1:]
		if (time.time()>lt):
			lt=time.time()+30
			fs.write("log.log",dt)



def cache(fp):
	global _c
	if (fp in _c):
		return _c[fp]
	with open(fp,"rb") as f:
		_c[fp]=f.read()
	return _c[fp]



def print(*a):
	global _pq
	if (_pq is None):
		_pq=[(a,inspect.getouterframes(inspect.currentframe(),2)[1])]
		threading.Thread(target=_print_q).start()
	else:
		_tl.acquire()
		_pq+=[(a,inspect.getouterframes(inspect.currentframe(),2)[1])]
		_tl.release()
