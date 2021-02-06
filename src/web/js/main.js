document.addEventListener("DOMContentLoaded",()=>{
	let nme=document.querySelector(".name-inp");
	let l0e=document.querySelector(".l0");
	let l1e=document.querySelector(".l1");
	let l2e=document.querySelector(".l2");
	let se=document.querySelector(".start");
	let lvl=0;
	l0e.onclick=()=>{
		l0e.classList.add("s");
		l1e.classList.remove("s");
		l2e.classList.remove("s");
		lvl=0;
	}
	l1e.onclick=()=>{
		l0e.classList.remove("s");
		l1e.classList.add("s");
		l2e.classList.remove("s");
		lvl=1;
	}
	l2e.onclick=()=>{
		l0e.classList.remove("s");
		l1e.classList.remove("s");
		l2e.classList.add("s");
		lvl=2;
	}
	se.onclick=()=>{
		if (nme.value.length>0){
			fetch("/api/create",{method:"POST",body:JSON.stringify({name:nme.value,level:lvl})}).catch((e)=>0).then((e)=>(e?e.json():0)).then((e)=>{
				if (!e||e.error){
					console.error(e);
				}
				else{
					location.href=e.url;
				}
			});
		}
	}
},false);
