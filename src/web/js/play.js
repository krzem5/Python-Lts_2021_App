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
	function _render_text(txt){
		return txt.replace(/__NAME__/gm,`<span class="txt-nm">`+window._dt.name+"</span>").replace(/\*\*((?:[^\*]|\*[^\*])*)\*\*/gm,(_,b)=>{
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
	window._check=(t,c)=>{
		if (st_kb_s==2){
			if (c){
				st_kb_s=0;
				spe.classList.remove("hint-v");
				t.classList.add("a-c");
				ca=t;
				ale.childNodes.forEach((e)=>{
					if (e!=t){
						e.classList.remove("a-s");
					}
				});
				_show_hint(3e3,3);
			}
			else{
				t.classList.add("a-w");
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
				ale.innerHTML=lvl[st_k].questions[st_si].a.map((e,i)=>{
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
		lvl=e[window._dt.level];
		_next();
	});
},false);
