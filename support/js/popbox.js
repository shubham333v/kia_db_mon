function docReady(fn){if(document.readyState==="complete"||document.readyState==="interactive"){setTimeout(fn,1); }else{document.addEventListener("DOMContentLoaded",fn); } }

class ConfBox{mainDiv;message="Say Ok !!!";nok="Cancel";ok="Ok";head="This page";okTimOut=5;
constructor(a){let k=Object.keys(a);for(let i=0;i<k.length;i++)this[k[i]]=a[k[i]];

let md=this.mainDiv=document.createElement("div");md.style.cssText="background:#0005;z-index:10;position:fixed;width:100%;height:100vh;top:0px;left:0px;";
let sd=document.createElement("div");sd.style.cssText="position:fixed;width:500px;height:300px;background:#252525;color:#fff;top:50%;left:50%;transform:translate(-50%,-50%);border:inset #555 4px; ";
let td=document.createElement("div");td.innerHTML=this.message;td.style.cssText="padding:10px; ";
let bd=document.createElement("div");bd.style.cssText="height:50px;padding:10px;position:absolute;bottom:0px;width:calc(100% - 20px); ";bd.classList.add("popConf");
let hd=document.createElement("div");hd.innerHTML=this.head;hd.style.cssText="height:50px;line-height:50px;border-bottom:#555 inset 4px;padding:0px 10px;font-size:1.2em;color:dodgerblue; ";
let od=document.createElement("div");od.innerText=this.okTimOut?this.okTimOut:this.ok;od.setAttribute("disabled",true);if(!this.okTimOut)od.onclick=this.okClick;
let nd=document.createElement("div");nd.onclick=this.nokClick;nd.innerText=this.nok;
if(this.okTimOut)this.okTimer=setInterval(()=>{od.innerText=this.okTimOut-=1;if(!this.okTimOut){od.innerText=this.ok;od.removeAttribute("disabled");od.onclick=this.okClick; };if(!this.okTimOut&&this.okTimer)clearTimeout(this.okTimer); },1000);

od.style.cssText=nd.style.cssText="display:inline-block;width:calc(50% - 4px);background:#111111;text-align:center;line-height:50px;border:inset 2px #353535;cursor:pointer; ";
md.appendChild(sd);
sd.appendChild(hd);
sd.appendChild(td);
sd.appendChild(bd);
bd.appendChild(od);
bd.appendChild(nd);
docReady(()=>{document.body.appendChild(md); });
}

okClick=()=>{document.body.removeChild(this.mainDiv);this.onOk(); }
nokClick=()=>{if(this.okTimer)clearTimeout(this.okTimer);document.body.removeChild(this.mainDiv);this.onNok(); }

onOk=()=>{ }
onNok=()=>{ }
 
}

class popBoxAl{md=null;
constructor(){
let md=document.createElement("div");this.md=md;
let bx=document.createElement("div");
let he=document.createElement("div");this.he=he;
let ms=document.createElement("div");this.ms=ms;
let ta=document.createElement("div");
md.appendChild(bx);
bx.appendChild(he);
bx.appendChild(ms);
bx.appendChild(ta);

md.style.cssText=`position:fixed;top:0;font-family:"Merriweather", serif;background-color:#5557;color:#fff;z-index:9999;width:100vw;height:100vh;display:none;`;
bx.style.cssText=`max-width:70%;left:50%;top:50%;position:fixed;transform:translate(-50%,-50%);padding:1em 1em;text-align:center;`;
he.style.cssText=`margin:0 0 1rem 0;font-size:8em;`;
ms.style.cssText=`margin-bottom:0.5em;font-size:3em;text-shadow:0 0 6px #216f79;`;
ta.style.cssText=`text-shadow:0 0 6px #216f79;font-style:italic;text-decoration:none;color:#216f79;text-shadow:0 0 6px #216f79;font-size:3em;cursor:pointer;`;
he.innerText="Error";ms.innerText="Reasion";ta.innerHTML='Reload!';ta.onclick=()=>{window.location.reload(); };docReady(()=>{document.body.appendChild(md); });
 }

show(ec,msg){this.he.innerText=ec;this.ms.innerText=msg;this.md.style.display="block"; }
hide(){this.md.style.display="none"; }
}


class popProgTSP1{md=null;

constructor(){let md=document.createElement("div");this.md=md;
md.style.cssText=`position:fixed;top:0;font-family:"Merriweather", serif;background-color:#5557;color:#fff;z-index:9999;width:100vw;height:100vh;display:none;`;

let sd=document.createElement("div");
sd.style.cssText=`display:flex;align-items:center;justify-content:center;width:150px;height:150px;position:relative;margin:auto;overflow:hidden;line-height:100vh;`;

let styMs=`position:absolute;width:calc(100% - 9.9px);height:calc(100% - 9.9px);border:5px solid transparent;border-top-color:#ff5722;border-radius:50%;
-webkit-animation:spin 5s cubic-bezier(0.17, 0.49, 0.96, 0.76) infinite;animation:spin 5s cubic-bezier(0.17, 0.49, 0.96, 0.76) infinite;`;

let ms1=document.createElement("div");ms1.style.cssText=styMs;
let ms2=document.createElement("div");ms2.style.cssText=styMs;
let ms3=document.createElement("div");ms3.style.cssText=styMs;
let ms4=document.createElement("div");ms4.style.cssText=styMs;
let ms5=document.createElement("div");ms5.style.cssText=styMs;
let ms6=document.createElement("div");ms6.style.cssText=styMs;
let ms7=document.createElement("div");ms7.style.cssText=styMs;
let ms8=document.createElement("div");ms8.style.cssText=styMs;
let ms9=document.createElement("div");ms9.style.cssText=styMs;

docReady(()=>{document.body.appendChild(md); });
md.appendChild(sd);
sd.appendChild(ms1);
ms1.appendChild(ms2);
ms2.appendChild(ms3);
ms3.appendChild(ms4);
ms4.appendChild(ms5);
ms5.appendChild(ms6);
ms6.appendChild(ms7);
ms7.appendChild(ms8);
ms8.appendChild(ms9);
 }

show(){this.md.style.display="flex"; }
hide(){this.md.style.display="none"; }
}



class Notification{type={success:{icon:"fa-circle-check",color:"#0abf30",name:"notifMsgSuccess"},error:{icon:"fa-circle-xmark",color:"#e24d4c",name:"notifMsgError"},warning:{icon:"fa-triangle-exclamation",color:"#e9bd0c",name:"notifMsgWarning"},info:{icon:"fa-circle-info",color:"#3498db",name:"notifMsgInfo"} };delay=10;

constructor(){let md=document.createElement("div");this.md=md;let t=this.type;md.className="notifications";docReady(()=>{document.body.appendChild(md); });
md.style.cssText=`position:fixed;top:0px;right:0px;color:#ccc;background:#000;display:block;max-height:100%;overflow-y:overlay;overflow-x:hidden;`;
let sty=`.notifications .hide{animation:hide_toast 0.3s ease forwards; }.notifications .notifClose:hover{color:dodgerblue; }
.`+t.success.name+`::before{background:`+t.success.color+`;color:`+t.success.color+`; }
.`+t.warning.name+`::before{background:`+t.warning.color+`;color:`+t.warning.color+`; }
.`+t.error.name+`::before{background:`+t.error.color+`;color:`+t.error.color+`; }
.`+t.info.name+`::before{background:`+t.info.color+`;color:`+t.info.color+`; }
@keyframes show_toast{0%{transform: translateX(100%); } 40%{transform: translateX(-5%); } 80%{transform:translateX(0%); } 100%{transform:translateX(-10px); } }
@keyframes hide_toast{0% {transform: translateX(-10px); } 40% {transform:translateX(0%); } 80% {transform:translateX(-5%); } 100% {transform:translateX(calc(100% + 20px)); } }
@keyframes progress {100% {width: 0%; } }.column::before{position:absolute;content:"";height:3px;width:400px;bottom:0px;left:0px;animation:progress `+this.delay+`s linear forwards; }.column-pause::before{animation-play-state:paused; }.column-play::before{animation-play-state:runing; }`;
let st=document.createElement("style");st.innerHTML=sty;this.md.appendChild(st); }

toast(a,b=this.type.info){new Bubble({elm:this.md,delay:this.delay},a,b); }
}

class Bubble{parent=null;timeout=null;

constructor(p,a="",b,pc){let now=new Date();
let td=now.getDate()+"/"+(now.getMonth()+1)+"/"+ now.getFullYear()+"  "+now.getHours()+":"+now.getMinutes()+":"+now.getSeconds();
let t=document.createElement("div");
let c=document.createElement("div");c.className="column "+b.name;
let nh=document.createElement("div");
let nm=document.createElement("div");
let ni=document.createElement("span");ni.className="fa "+b.icon;
let ntd=document.createElement("span");
let nc=document.createElement("span");

t.style.cssText=`width:400px;overflow:auto;border-radius:4px;padding:16px;margin-bottom:10px;background:#222;animation:show_toast 0.3s ease forwards;`;
c.style.cssText='width:100%; ';
nh.style.cssText=`border-bottom:4px solid #000;padding-bottom:10px;`;
ni.style.cssText=`font-size:1.75rem;display:inline-block;line-height:1;vertical-align: middle;color:`+b.color;
ntd.style.cssText=`font-size:1em;display:inline-block;line-height:1;vertical-align: middle;margin-left:10px;width:calc(100% - 2.75em - 10px);`;
nc.style.cssText=`font-size:1em;display:inline-block;line-height:1;vertical-align: middle;cursor:pointer;`;nc.className="notifClose";
nm.style.cssText=`margin-top:10px;margin-left:10px;display:block;`;

var timer=new Timer(()=>{if(t)p.elm.removeChild(t); },p.delay*1000);
nc.onclick=()=>{p.elm.removeChild(t);if(timer)timer.cleare(); }
//this.timeout=setTimeout(()=>{if(t)p.elm.removeChild(t);this.timeout=null; },p.delay*1000);
t.onmousedown=()=>{c.classList.add("column-pause");timer.pause(); }
t.onmouseup=()=>{c.classList.remove("column-pause");timer.resume(); }

ntd.innerText=td;
nc.innerText="X";
nm.innerText=a;

t.appendChild(c);
c.appendChild(nh);
c.appendChild(nm);

nh.appendChild(ni);
nh.appendChild(ntd);
nh.appendChild(nc);
if(p.elm)p.elm.appendChild(t);
    }
}