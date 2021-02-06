document.addEventListener("DOMContentLoaded",()=>{
	function _render_text(txt){
		return txt.replace(/__NAME__/gm,window._dt.name).replace(/\*\*((?:[^\*]|\*[^\*])*)\*\*/gm,`<span class="highlight">$1</span>`);
	}
	fetch("/api/storyline").then((e)=>e.json()).then((e)=>{
		document.body.innerHTML+=`window._dt = ${JSON.stringify(window._dt)}<br><br>storyline = ${JSON.stringify(e)}<br><br>rendering = ${_render_text(e[0].saving.desc)}`;
	});
},false);
