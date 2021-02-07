document.addEventListener("DOMContentLoaded",()=>{
	let bge=document.querySelector(".bg");
	let wre=document.querySelector(".wr");
	let be=document.querySelector(".main");
	let tle=document.querySelector(".txt-l");
	let tce=document.querySelector(".txt-c");
	let tqe=document.querySelector(".txt-q");
	let ale=document.querySelector(".a-list");
	let spe=document.querySelector(".hint");
	let lvl;
	let st_k=0;
	let st_s=0;
	let st_kb_s=0;
	let st_si=0;
	let ca;
	let dt="$$$__DATA__$$$";
	let qa;
	function _render_text(txt){
		return txt.replace(/__NAME__/gm,`<span class="txt-nm">`+dt.name+"</span>").replace(/\*\*((?:[^\*]|\*[^\*])*)\*\*/gm,(_,b)=>{
			return `<span class="txt-h">`+b.split("").map((e,i)=>{
				return `<span class="txt-h-letter" style="animation-delay:${i/10}s">${(e==" "?"&nbsp;":e)}</span>`;
			}).join("")+"</span>";
		});
	}
	function _show_hint(t,v){
		if (spe._tm){
			clearTimeout(spe._tm);
		}
		spe._tm=setTimeout(()=>{
			if (v==3){
				spe.innerHTML=`Press <span class="kb">Space</span> to Continue`;
				v=1;
			}
			st_kb_s=v;
			spe.classList.add("hint-v");
		},t);
	}
	function _coin(e){
		e._dy+=10*(1/60);
		e._x+=e._dx;
		e._y+=e._dy;
		e.style.top=`${e._y}px`;
		e.style.left=`${e._x}px`;
		if (e._y>window.innerHeight+30){
			clearInterval(e._in);
			document.body.removeChild(e);
		}
	}
	window._check=(t,c)=>{
		if (st_kb_s==2&&!t._c){
			qa++;
			if (c){
				fetch("/api/answer",{method:"PUT",body:JSON.stringify({a:qa})});
				st_kb_s=0;
				spe.classList.remove("hint-v");
				t.classList.add("a-c");
				ca=t;
				ale.childNodes.forEach((e)=>{
					if (e!=t){
						e.classList.remove("a-s");
					}
				});
				let r=t.getBoundingClientRect();
				for (let i=0;i<10;i++){
					let e=document.createElement("img");
					e.classList.add("coin");
					setTimeout(()=>{
						e.src="/rsrc/coin.gif";
						document.body.appendChild(e);
					},Number.parseInt(Math.random()*100));
					e._x=r.x+r.width/2;
					e._y=r.y+r.height/2;
					e._dx=Math.random()*4-2;
					e._dy=-Math.random()*2-10;
					e._in=setInterval(_coin,16,e);
				}
				_show_hint(3e3,3);
			}
			else{
				t.classList.add("a-w");
				t._c=1;
			}
		}
	}
	function _next(){
		st_kb_s=0;
		if (st_s==0){
			spe.classList.remove("hint-v");
			tce.classList.remove("txt-c-s");
			setTimeout(()=>{
				spe.innerHTML=`Press <span class="kb">Space</span> to Continue`;
				tce.innerHTML=_render_text(lvl[st_k].desc[st_si]);
				tce.classList.add("txt-c-s");
				_show_hint(3e3,1);
				st_si++;
				if (st_si==lvl[st_k].desc.length){
					st_si=0;
					st_s=1;
				}
			},(st_si?2e3:0));
		}
		else if (st_s==1){
			spe.classList.remove("hint-v");
			tce.classList.remove("txt-c-s");
			setTimeout(()=>{
				tle.innerHTML=_render_text(lvl[st_k].lesson);
				tle.classList.add("txt-l-v");
				_show_hint(3e3,1);
				st_s=2;
			},2e3);
		}
		else if (st_s==2){
			spe.classList.remove("hint-v");
			tle.classList.add("txt-l-t");
			tce.innerHTML=_render_text(lvl[st_k].q_desc);
			tce.classList.add("txt-c-s");
			_show_hint(3e3,1);
			st_s=3;
		}
		else if (st_s==3){
			spe.classList.remove("hint-v");
			tce.classList.add("txt-c-t");
			tqe.classList.remove("txt-q-s");
			if (ca){
				ca.classList.remove("a-s");
			}
			setTimeout(()=>{
				spe.innerHTML=`<span class="kb">Click</span> on the Correct Anwser`;
				tqe.innerHTML=_render_text(lvl[st_k].questions[st_si].q);
				tqe.classList.add("txt-q-s");
				ale.innerHTML="";
				qa=0;
				ale.innerHTML=lvl[st_k].questions[st_si].a.map((e,i)=>{
					qa++;
					return `<div class="a" onclick="window._check(this,${(i==lvl[st_k].questions[st_si].c?1:0)})"><div class="a-dt">${e}</div></div>`;
				}).join("");
				ale.childNodes.forEach((e,i)=>{
					setTimeout(()=>{
						e.classList.add("a-s");
					},i*1e3+2e3);
				});
				_show_hint(lvl[st_k].questions[st_si].a.length*1e3+2e3,2);
				st_si++;
				if (st_si==lvl[st_k].questions.length){
					st_si=0;
					st_s=4;
				}
			},(st_si?2e3:0));
		}
		else{
			spe.classList.remove("hint-v");
			tce.classList.remove("txt-c-s");
			tle.classList.remove("txt-l-v");
			tqe.classList.remove("txt-q-s");
			ca.classList.remove("a-s");
			setTimeout(()=>{
				tce.classList.remove("txt-c-t");
				tle.classList.remove("txt-l-t");
				st_k++;
				if (st_k==lvl.length){
					location.href="/";
				}
				st_s=0;
				_next();
			},2e3);
		}
	}
	window.onresize=()=>{
		bge.style.height="initial";
		wre.style.height="initial";
		let h=Math.max(be.getBoundingClientRect().height+305,document.body.getBoundingClientRect().height-70);
		bge.style.height=`${h+70}px`;
		wre.style.height=`${h}px`;
	};
	window.onresize();
	document.body.onkeyup=(e)=>{
		if (st_kb_s==1&&e.key==" "){
			_next();
		}
	}
	fetch("/api/storyline").then((e)=>e.json()).then((e)=>{
		lvl=e[dt.level];
		_next();
	});
},false);
