class TogOpt extends HTMLElement{ttl;cnt;onselected=null;_value=null;fired=false;
 constructor(){super(); }
    
 get value(){return this._value||this.getAttribute("value"); }
 set value(a){this.clrActBlk(this.cnt);let cnt=this.cnt.children;for(let i=0;i<cnt.length;i++){let ccn=cnt[i];let cv=ccn.getAttribute("value");
 if(cv==a){this.shv.textContent=ccn.textContent;if(!ccn.classList.contains("act-blk"))ccn.classList.add("act-blk") }; };this._value=a;this.setAttribute("value",a); }

 get title(){return this.ttl.innerText; }

 get showvalue(){return this.getAttribute("showvalue"); }
 set showvalue(a){this.setAttribute("showvalue",a);this.ttl.innerHTML="";this.ttl.appendChild(this.shv);this.shv.style.display=a!="true"?"none":"inline-block"; }
    
 get style(){return this.getAttribute("style"); }
 set style(a){this.setAttribute("style",a);let css=a.split(";");for(let i=0;i<css.length;i++){let val=css[i].split(":");if(val[0]==="height"){this.cnt.style.top=val[1]; };this.ttl.style[val[0]]=val[1]; }; }
 clrActBlk=(p)=>{let pc=p.children;for(let i=0;i<pc.length;i++)pc[i].classList.remove("act-blk"); }
 onSelected=(a)=>{}

 pushItem=(a,b=null)=>{let nc=document.createElement("li");nc.innerHTML=a;if(b==null||b==undefined)b=a;nc.setAttribute("value",b);this.cnt.appendChild(nc);nc.onclick=()=>{let v=nc.getAttribute("value")||nc.textContent;this.clrActBlk(this.cnt);if(!nc.classList.contains("act-blk"))nc.classList.add("act-blk");if(this.shv.textContent!=v){this.value=v;this.onSelected(v);this.shv.textContent=nc.textContent; } };return nc; }

connectedCallback(){if(this.fired)return;this.fired=true;let showvalue="false";let value=null;
    if(this.hasAttribute("showvalue"))showvalue=this.getAttribute("showvalue");
    if(this.hasAttribute("value"))value=this.getAttribute("value");
    if(this.hasAttribute("onSelected"))this.onSelected=eval(this.getAttribute("onSelected"));

    let child=this.children;
    let t=document.createElement("div");;
    while(child[0])t.appendChild(child[0]);

    let mct=document.createElement("ul");this.appendChild(mct);
    let ttl=document.createElement("li");mct.appendChild(ttl);
    let shv=document.createElement("aside");
    let cnt=document.createElement("ul");ttl.innerHTML="Title";
    while(t.children[0]){let cc=t.children[0];if(cc.classList.contains("opt-head")){mct.removeChild(ttl);ttl=cc;mct.appendChild(cc);ttl.appendChild(shv);continue; };cnt.appendChild(cc);cc.onclick=()=>{this.clrActBlk(cnt);if(!cc.classList.contains("act-blk"))cc.classList.add("act-blk");let v=cc.getAttribute("value")||cc.textContent;if(shv.textContent!=v){this.value=v;this.onSelected(v);shv.textContent=cc.textContent; } };let ccc=cc.getAttribute("value")||cc.textContent;if(ccc==value)shv.textContent=cc.textContent; }
    mct.appendChild(cnt);this.ttl=ttl;this.shv=shv;this.cnt=cnt;ttl.appendChild(shv);

    this.classList.add("drop-down-label");

    mct.classList.add("drop-down");
    mct.classList.add("drop-closed");

    shv.classList.add("opt-inp");
    
    shv.style.display=showvalue!="true"?"none":"inline-block";
    ttl.classList.add("opt-head");
    cnt.classList.add("opt-cont");
    
    ttl.addEventListener("click",()=>{mct.classList.toggle("drop-closed"); });
    
    document.addEventListener("click",(e)=>{let t=e.target;let p=t;for(let i=0;i<1;i++){p=p.parentElement;if(!p)return;if(p==mct){return; }; };if(!mct.classList.contains("drop-closed"))mct.classList.add("drop-closed"); });
  }
}

class TogOptMul extends HTMLElement{ttl;cnt;onselected=null;_value=null;
 constructor(){super(); }
    
 get value(){return this.getAttribute("value")||this._value; }
 set value(a){this._value=a;this.setAttribute("value",a);this._ckValchn(); }

 get title(){return this.ttl.innerText; }

 get showvalue(){return this.getAttribute("showvalue"); }
 set showvalue(a){this.setAttribute("showvalue",a); }
    
 get style(){return this.getAttribute("style"); }
 set style(a){this.setAttribute("style",a);let css=a.split(";");for(let i=0;i<css.length;i++){let val=css[i].split(":");if(val[0]==="height"){this.cnt.style.top=val[1]; };this.ttl.style[val[0]]=val[1]; }; }

_ckChange(){let cch=this.cnt.children;let fv=[];for(let i=0;i<cch.length;i++){let ci=cch[i];let cic=ci.children;if(cic.length>0){if(cic[0].tagName=="LABEL"){let cic0=cic[0].children;if(cic0.length>0&&cic0[0].tagName=="INPUT"){if(cic0[0].checked)fv.push(ci.getAttribute("value")||ci.textContent); } } }; };let nv=this._value=fv.join(",");this.setAttribute("value",nv);this.onSelected(this._value); }

_ckValchn(){let v=this.value.split(",");let cch=this.cnt.children;for(let i=0;i<cch.length;i++){let ci=cch[i];let cic=ci.children;if(cic.length>0){if(cic[0].tagName=="LABEL"){let cic0=cic[0].children;if(cic0.length>0&&cic0[0].tagName=="INPUT"){let cv=ci.getAttribute("value")||ci.textContent;if(v.indexOf(cv)>=0)cic0[0].checked=true; } } }; }; }

 onSelected=(a)=>{}

 pushItem=(a,b=null)=>{let nc=document.createElement("li");let rb=document.createElement("input");let lb=document.createElement("label");rb.type="checkbox";lb.appendChild(rb);rb.onclick=()=>this._ckChange();let la=document.createTextNode(a);lb.appendChild(la);nc.appendChild(lb);if(b)nc.setAttribute("value",b);this.cnt.appendChild(nc); }

 clrItem=()=>{let i=0;let cnt=this.cnt;let cntc=cnt.children;while(cntc[i]){if(cntc[i]==this.seAl)i++;else cnt.removeChild(cntc[i]); } }

connectedCallback(){let showvalue="false";let value=null;
    if(this.hasAttribute("showvalue"))showvalue=this.getAttribute("showvalue");
    if(this.hasAttribute("value"))value=this.getAttribute("value");
    if(this.hasAttribute("onSelected"))this.onSelected=eval(this.getAttribute("onSelected"));

    let child=this.children;
    let t=document.createElement("div");
    while(child[0])t.appendChild(child[0]);

    let mct=document.createElement("ul");this.appendChild(mct);
    let ttl=document.createElement("li");mct.appendChild(ttl);
    let cnt=document.createElement("ul");ttl.innerHTML="Title";

    let seAl=document.createElement("li");seAl.innerText="All";cnt.appendChild(seAl);this.seAl=seAl;
    seAl.onclick=()=>{let ckd=null;let cch=cnt.children;for(let i=0;i<cch.length;i++){let cic=cch[i].children;if(cic.length>0){if(cic[0].tagName=="LABEL"){let cic0=cic[0].children;if(cic0.length>0&&cic0[0].tagName=="INPUT"){if(ckd==null)ckd=!cic0[0].checked;cic0[0].checked=ckd; } } }; };this._ckChange(); }

    while(t.children[0]){let cc=t.children[0];if(cc.classList.contains("opt-head")){mct.removeChild(ttl);ttl=cc;mct.appendChild(cc);continue; };
    let rb=document.createElement("input");let lb=document.createElement("label");rb.type="checkbox";lb.appendChild(rb);rb.onclick=()=>this._ckChange();while(cc.children[0])lb.appendChild(cc.children[0]);while(cc.childNodes[0])lb.appendChild(cc.childNodes[0]);cc.appendChild(lb);cnt.appendChild(cc); }

    mct.appendChild(cnt);this.ttl=ttl;this.cnt=cnt;

    mct.classList.add("drop-down");
    mct.classList.add("drop-closed");

    ttl.classList.add("opt-head");
    cnt.classList.add("opt-cont");
    
    ttl.addEventListener("click",()=>{mct.classList.toggle("drop-closed"); });
    document.addEventListener("click",(e)=>{let t=e.target;let p=t;for(let i=0;i<4;i++){p=p.parentElement;if(!p)return;if(p==mct){return; }; };if(!mct.classList.contains("drop-closed"))mct.classList.add("drop-closed"); });
  }  
}

class autoComp extends HTMLElement{_acArr=["abc","ssaa","SsaADAS"];_cuArr=0;

get value(){return this.inp.value; }
set value(a){this.inp.value=a; }

onSelected=(a)=>{}
connectedCallback(){
  if(this.hasAttribute("onSelected"))this.onSelected=eval(this.getAttribute("onSelected"));
    let child=this.children;
    let inp=this.inp=document.createElement("input");
    let aclp=this.aclp=document.createElement("div");
    let acl=this.acl=document.createElement("div");
    let srh=this.srh=document.createElement("i");
    let inpc=false;let inc=0;
    while(child[inc]){let cc=child[inc];if(cc.tagName=="INPUT"){inp=this.inp=cc;inpc=true; };if(cc.tagName=="I")srh=this.srh=cc;inc++; }
    if(!inpc)this.appendChild(inp);
    this.appendChild(aclp);
    aclp.appendChild(acl);
    acl.classList.add("autocomplete-items");
    this.style.display="inline-block";
    this.classList.add("autocomplete");

    srh.onclick=()=>{this.onSelected(this.inp.value); }

    aclp.style.cssText="width:inherit;overflow:hidden;";

  inp.addEventListener("input",this.parseData);
  inp.addEventListener("click",this.parseData);

  inp.addEventListener("keydown",(e)=>{let xa=this.acl;let x=xa.children;if(e.keyCode==40){this._cuArr++;this.addActive(x); }else if(e.keyCode==38){this._cuArr--;this.addActive(x); }else if(e.keyCode==13){e.preventDefault();if(this._cuArr>-1){if(x)x[this._cuArr].click(); }} });

  document.addEventListener("click",(e)=>{if(e.target==this.acl||e.target==this||e.target==this.inp)return;this.closeAllLists(e.target); });
}

setArr=(a)=>{this._acArr=a; }

parseData=()=>{let t=this.inp;let arr=this._acArr;let i,val=t.value;this.closeAllLists();if(!val){return false; };this._cuArr=-1;if(this.aclp.style.display==="none")this.aclp.style.display="block";for(i=0;i<arr.length;i++){let ai=arr[i];let al=ai.toLowerCase();let vl=val.toLowerCase();if(al.indexOf(vl)>=0){let b=document.createElement("DIV");b.innerText=ai;this.acl.appendChild(b);b.addEventListener("click",(e)=>{let tv=this.inp.value=e.target.textContent;this.closeAllLists();this.onSelected(tv); }); }} }

addActive(x){if(!x)return false;this.removeActive(x);if(this._cuArr>=x.length)this._cuArr=0;if(this._cuArr<0)this._cuArr=(x.length-1);x[this._cuArr].classList.add("autocomplete-active"); }

removeActive(x){for(let i=0;i<x.length;i++){x[i].classList.remove("autocomplete-active"); }}
closeAllLists(){let x=this.acl.children;this.aclp.style.display="none";while(x[0]){if(x[0]){this.acl.removeChild(x[0]);} }}

}

function autocomplete(inp,arr){let currentFocus;inp.addEventListener("input",function(e){let a,b,i,val=this.value;closeAllLists();if(!val){return false; };currentFocus=-1;a=document.createElement("DIV");a.setAttribute("id",this.id+"autocomplete-list");a.setAttribute("class","autocomplete-items");this.parentNode.appendChild(a);
for(i=0;i<arr.length;i++){let ai=arr[i];let al=ai.toLowerCase();let vl=val.toLowerCase();if(al.indexOf(vl)>=0){b=document.createElement("DIV");b.innerText=ai;b.addEventListener("click",function(e){inp.value=e.target.textContent;closeAllLists(); });a.appendChild(b); }} });

inp.addEventListener("keydown",function(e){let x=document.getElementById(this.id+"autocomplete-list");if(x)x=x.getElementsByTagName("div");if(e.keyCode==40){currentFocus++;addActive(x); }else if(e.keyCode==38){currentFocus--;addActive(x); }else if(e.keyCode==13){e.preventDefault();if(currentFocus>-1){if(x)x[currentFocus].click(); }} });

function addActive(x){if(!x)return false;removeActive(x);if(currentFocus>=x.length)currentFocus=0;if(currentFocus<0)currentFocus=(x.length-1);x[currentFocus].classList.add("autocomplete-active"); }

function removeActive(x){for(let i=0;i<x.length;i++){x[i].classList.remove("autocomplete-active"); }}
function closeAllLists(elmnt){let x=document.getElementsByClassName("autocomplete-items");for(let i=0;i<x.length;i++){if(elmnt!=x[i]&&elmnt!=inp){x[i].parentNode.removeChild(x[i]);} }}
document.addEventListener("click",function(e){closeAllLists(e.target); });
}

customElements.define("tog-opt",TogOpt);
customElements.define("auto-comp",autoComp);
customElements.define("tog-opt-mul",TogOptMul);