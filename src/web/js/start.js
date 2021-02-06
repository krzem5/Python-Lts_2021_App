document.addEventListener("DOMContentLoaded",()=>{
	fetch("/api/storyline").then((e)=>e.json()).then((e)=>{
		document.body.innerHTML+=`window._dt=${JSON.stringify(window._dt)};storyline=${JSON.stringify(e)}`;
	});
},false);
