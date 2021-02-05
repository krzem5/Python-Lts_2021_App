document.addEventListener("DOMContentLoaded",()=>{
	let nme=document.querySelector(".name-inp");
	let l0e=document.querySelector(".l0");
	let l1e=document.querySelector(".l1");
	let se=document.querySelector(".start");
	let lvl=0;
	l0e.onclick=()=>{
		l0e.classList.add("s");
		l1e.classList.remove("s");
		lvl=0;
	}
	l1e.onclick=()=>{
		l0e.classList.remove("s");
		l1e.classList.add("s");
		lvl=1;
	}
	se.onclick=()=>{
		if (nme.value.length>0){
			console.log(lvl,nme.value)
		}
	}
},false);
