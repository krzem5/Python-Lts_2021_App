document.addEventListener("DOMContentLoaded",()=>{
	let bge=document.querySelector(".bg");
	let wre=document.querySelector(".wr");
	let be=document.querySelector(".main");
	let tle=document.querySelector(".txt-l");
	let tce=document.querySelector(".txt-c");
	let tqe=document.querySelector(".txt-q");
	let ale=document.querySelector(".a-list");
	let spe=document.querySelector(".space");
	let storyline;
	let lvl;
	let st_k;
	let st_s=0;
	let st_kb_s=0;
	let st_si=0;
	window.onresize=()=>{
		bge.style.height="initial";
		wre.style.height="initial";
		let h=Math.max(be.getBoundingClientRect().height+305,document.body.getBoundingClientRect().height-70);
		bge.style.height=`${h+70}px`;
		wre.style.height=`${h}px`;
	};
	window.onresize();
	function _render_text(txt){
		return txt.replace(/__NAME__/gm,`<span class="txt-nm">`+window._dt.name+"</span>").replace(/\*\*((?:[^\*]|\*[^\*])*)\*\*/gm,(_,b)=>{
			return `<span class="txt-h">`+b.split("").map((e,i)=>{
				return `<span class="txt-h-letter" style="animation-delay:${i/10}s">${(e==" "?"&nbsp;":e)}</span>`;
			}).join("")+"</span>";
		});
	}
	function _show_space(){
		if (spe._tm){
			clearTimeout(spe._tm);
		}
		spe._tm=setTimeout(()=>{
			st_kb_s=1;
			spe.classList.add("space-v");
		},3e3);
	}
	function _next(){
		st_kb_s=0;
		if (st_s==0){
			spe.classList.remove("space-v");
			tce.classList.remove("txt-c-s");
			setTimeout(()=>{
				tce.innerHTML=_render_text(lvl[st_k].desc[st_si]);
				tce.classList.add("txt-c-s");
				_show_space();
				st_si++;
				if (st_si==lvl[st_k].desc.length){
					st_si=0;
					st_s=1;
				}
			},(st_si?2e3:0));
		}
		else if (st_s==1){
			spe.classList.remove("space-v");
			tce.classList.remove("txt-c-s");
			setTimeout(()=>{
				tle.innerHTML=_render_text(lvl[st_k].lesson);
				tle.classList.add("txt-l-v");
				_show_space();
				st_s=2;
			},2e3);
		}
		else if (st_s==2){
			spe.classList.remove("space-v");
			tle.classList.add("txt-l-t");
			tce.innerHTML=_render_text(lvl[st_k].q_desc);
			tce.classList.add("txt-c-s");
			_show_space();
			st_s=3;
		}
		else if (st_s==3){
			spe.classList.remove("space-v");
			tce.classList.add("txt-c-t");
			console.log(lvl[st_k].questions[st_si])
			setTimeout(()=>{
				tqe.innerHTML=_render_text(lvl[st_k].questions[st_si].q);
				tqe.classList.add("txt-q-s");
				if (lvl[st_k].questions[st_si].a.lentgh==2){
					ale.innerHTML=lvl[st_k].questions[st_si].a.map((e)=>{
						return `<div class="a">${e}</div>`;
					}).join("");
				}
				st_si++;
				if (st_si==lvl[st_k].questions.length){
					st_si=0;
					st_s=4;
				}
			});
		}
	}
	document.body.onkeyup=(e)=>{
		if (st_kb_s&&e.key==" "){
			_next();
		}
	}
	// window._dt={"name":"ABCDEFG","level":0};e=[{"saving":{"title":"Saving","desc":["On another beautiful day in the farm, __NAME__'s Parents gave him his 10 dollars allowance for the week","It could be enough to buy 4 chocolate bars, __NAME__ however thought he should buy **only one chocolate** for today, another one in a few days, and save the rest of his money..."],"lesson":"When you receive money, you should almost never spend it **all at once**. Instead, save some for later as you will probably need it.","q_desc":"__NAME__ is paid 5 dollars by his parents for helping them in the field, a couple of hours later he is offered a very cool board game by a his friend, Ben, for 5 dollars, or a Doll that costs only 2 dollars...","questions":[{"q":"What should __NAME__ do?","a":["Buy the Board game","Save the 5 dollars","But the doll and save the rest of the money"],"c":2},{"q":"If __NAME__ decides to save some money, where should he keep it?","a":["Give it to his friends for safekeeping","Put it in a secure place","Just put it anywhere"],"c":1}]},"investing_basics":{"title":"Investing Basics","desc":"While __NAME__ was shopping for some groceries with his family, he notices that his family bought some apples, while __NAME__ wanted to throw them in the trash after eating them, his parents advised him that it would be better if he **planted those seeds**, which will soon grow into a tree that gives __NAME__ **more and more Apples**.","lesson":"Investing on a basic level is using what you have now to make profit and __NAME__ bought one apple and will soon have **many** when the tree grows.","q_desc":"While chatting with his friends about games, __NAME__ remembers that he has a board game that he bought from a friend of his, that he doesn't play with anymore and it has become exceedingly rare, all his friends want one... However it is missing a few cards that can be bought from the shop.","questions":[{"q":"Should __NAME__ consider selling his game?","a":["No, he wants to keep it even though he doesn't use it","Yes, because it can give him more money than he used to buy it"],"c":1},{"q":"Should __NAME__ buy the cards?","a":["Yes, and keep the game for himself","No, it's a waste of money","Yes, because it will make his friends want the game more"],"c":2}]}},{"dangers_of_not_saving":{"title":"Dangers of not Saving","desc":"__NAME__'s farm was infested with pests, which threaten the farm's crops, __NAME__ learns that he needs to buy some pesticide which he can kill the pests before they damage the crops. Luckily __NAME__ was prepared as he had saved some money for cases like this, so __NAME__ buys the supplies he needs and saves the day.","lesson":"__NAME__ could have lost his crops if he had spent all the money that he was making, it is because he **saved some money** for emergencies, that he was able to act quickly to save the farm.","q_desc":"The news start talking about a possible flood coming to __NAME__'s farm area, __NAME__ thinks that he should spend all of his money on a brand new phone...","questions":[{"q":"Should __NAME__ buy the new phone?","a":["No, he should save money in case he needs it when the flood comes","Yes, the flood may not come anyways"],"c":0},{"q":"After the flood passes, should __NAME__ then spend every last dollar he has on something that isn't absolutely necessary?","a":["No, cause other emergencies may happen in the future","Yes, he can start saving money whenever"],"c":0}]},"asset_management":{"title":"Asset Management","desc":"__NAME__ has a beautiful house near the farm that he bought a few years ago that he no longer uses, __NAME__ wants to make use of the house so he starts thinking of selling it... __NAME__ then decides to **rent it** to someone as it will generate him **more profit** than just selling it straight away, and will in the same time leave __NAME__ the option of using the house again if he ever needs it.","lesson":"__NAME__ utilizes his assets (in this case his house) in a profitable way to get the most benefit from his house.","q_desc":"The news are talking that most of the people from __NAME__'s area of residence are starting to leave the area to go live somewhere else, __NAME__ still has his house over there and still not being used...__NAME__ got a good offer to sell the house...","questions":[{"q":"Should __NAME__ sell the house?","a":["No, as he will definitely find people to rent the house to","Yes, as he will not find any more people to rent the house too"],"c":1},{"q":"Should __NAME__ buy a new house in his area as investment?","a":["Yes, as he might sell if for a high price, even though his area lacks in customers","No, as he will not find customers that could buy the house for a higher price"],"c":1}]}}];
	fetch("/api/storyline").then((e)=>e.json()).then((e)=>{
		storyline=e;
		lvl=e[0/*window._dt.level*/];
		st_k=Object.keys(lvl)[0];
		_next();
	});
},false);
