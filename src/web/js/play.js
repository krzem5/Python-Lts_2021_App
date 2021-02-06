document.addEventListener("DOMContentLoaded",()=>{
	let bge=document.querySelector(".bg");
	let wre=document.querySelector(".wr");
	let be=document.querySelector(".main");
	window.onresize=()=>{
		bge.style.height="initial";
		wre.style.height="initial";
		let h=Math.max(be.getBoundingClientRect().height+305,document.body.getBoundingClientRect().height-70);
		bge.style.height=`${h+70}px`;
		wre.style.height=`${h}px`;
	};
	window.onresize();
	function _render_text(txt){
		return txt.replace(/__NAME__/gm,window._dt.name).replace(/\*\*((?:[^\*]|\*[^\*])*)\*\*/gm,`<span class="highlight">$1</span>`);
	}
	fetch("/api/storyline").then((e)=>e.json()).then((e)=>{
		be.innerHTML+=`window._dt = ${JSON.stringify(window._dt)}<br><br>storyline = ${JSON.stringify(e)}<br><br>rendering = ${_render_text(e[0].saving.desc)}`;
	});
},false);
