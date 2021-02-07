document.addEventListener("DOMContentLoaded",()=>{
	let bge=document.querySelector(".bg");
	let wre=document.querySelector(".wr");
	let be=document.querySelector(".box");
	let nme=document.querySelector("#nm-inp");
	let l0e=document.querySelector(".lvl-0");
	let l1e=document.querySelector(".lvl-1");
	let l2e=document.querySelector(".lvl-2");
	let ee=document.querySelector(".err");
	let lvl=0;
	location.hash="";
	window.onresize=()=>{
		bge.style.height="initial";
		wre.style.height="initial";
		let h=Math.max(be.getBoundingClientRect().height+305,document.body.getBoundingClientRect().height-70);
		bge.style.height=`${h+70}px`;
		wre.style.height=`${h}px`;
	};
	window.onresize();
	l0e.onclick=()=>{
		l0e.classList.add("lvl-s");
		l1e.classList.remove("lvl-s");
		l2e.classList.remove("lvl-s");
		lvl=0;
	}
	l1e.onclick=()=>{
		l0e.classList.remove("lvl-s");
		l1e.classList.add("lvl-s");
		l2e.classList.remove("lvl-s");
		lvl=1;
	}
	l2e.onclick=()=>{
		l0e.classList.remove("lvl-s");
		l1e.classList.remove("lvl-s");
		l2e.classList.add("lvl-s");
		lvl=2;
	}
	document.querySelector(".start-g").onclick=()=>{
		if (nme.value.length==0){
			if (ee.t){
				clearTimeout(ee.t);
			}
			ee.innerText="Please specify a Name";
			ee.classList.add("e");
			ee.t=setTimeout(()=>{
				ee.classList.remove("e");
			},5e3);
		}
		else{
			fetch("/api/create",{method:"POST",body:JSON.stringify({name:nme.value,level:lvl})}).catch((e)=>0).then((e)=>(e?e.json():0)).then((e)=>{
				if (!e||e.error){
					if (ee.t){
						clearTimeout(ee.t);
					}
					ee.innerText="Error Connecting to the Server";
					ee.classList.add("e");
					ee.t=setTimeout(()=>{
						ee.classList.remove("e");
					},5e3);
				}
				else{
					location.href=e.url;
				}
			});
		}
	}
	setTimeout(()=>{
		wre.classList.add("start");
	},1e3);
},false);
