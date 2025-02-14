class DateTimePicker extends HTMLElement{_vals={d:"00",m:"00",y:"0000",h:"00",i:"00",s:"00"};_spl="-";realDate=new Date();

constructor(){super(); }

get value(){return this.getAttribute("value"); }
set value(a){this.lbl.innerText=a;return this.setAttribute("value",a); }

initVal=()=>{let v=this._vals;this.value=v.y+"-"+v.m+"-"+v.d+" "+v.h+":"+v.i+":"+v.s;this.realDate=new Date(v.y,v.m-1,v.d,v.h,v.i,v.s);this.onchanged(this.value);  }
clrActBlk=(p)=>{let pc=p.children;for(let i=0;i<pc.length;i++)pc[i].classList.remove("act-blk"); }

changeVal=(tx,l=2,atr="d",p,elm)=>{if(typeof tx=="object"){for(let i=0;i<tx.length;i++){let ct=tx[i];let _tx=ct[0]||"",_l=ct[1]||2,_atr=ct[2]||"d",_p=ct[3]||null,_elm=ct[4]||null;
if(_p&&_elm){this.clrActBlk(_p);if(_elm.classList.contains("act-blk"))return;_elm.classList.add("act-blk"); };_tx+="";_tx=_tx.replace(" ","");this._vals[_atr]=padZero(_tx,_l); };return this.initVal(); };if(p){this.clrActBlk(p);if(elm.classList.contains("act-blk"))return;elm.classList.add("act-blk"); };tx+="";tx=tx.replace(" ","");this._vals[atr]=padZero(tx,l);this.initVal(); }

onchanged=(a)=>{}

updateVal=(d=new Date())=>{if(typeof d=="string")d=new Date(d);if(!(d instanceof Date))d=new Date();let mopt=this.mopt,yopt=this.yopt,dopt=this.dopt,thr=this.thr,tmn=this.tmn;
  let td=d.getDate(),tm=d.getMonth(),ty=d.getUTCFullYear(),th=d.getHours(),ti=d.getMinutes();let ed=dopt.children[td],ei=tmn.children[ti],eh=thr.children[th];
  this.changeVal([[tm+1,2,"m"],[ty,4,"y"],[td,2,"d",dopt,ed],[th,2,"h",thr,eh],[ti,2,"i",tmn,ei]]);mopt.value=tm;yopt.value=ty; }

connectedCallback(){let date=new Date();let mNames=["January","February","March","April","May","June","July","August","September","October","November","December"];

    if(this.hasAttribute("value"))value=this.getAttribute("value");
    if(this.hasAttribute("onSelected"))this.onSelected=eval(this.getAttribute("onSelected"));

    let lbl=this.lbl=document.createElement("span");this.appendChild(lbl);
    let mct=document.createElement("div");this.appendChild(mct);
    let mmy=document.createElement("div");mct.appendChild(mmy);
    let tmy=document.createElement("div");mct.appendChild(tmy);
    let my=document.createElement("div");mmy.appendChild(my);
    let mopt=this.mopt=document.createElement("tog-opt");my.appendChild(mopt);mopt.showvalue="true";
    let yopt=this.yopt=document.createElement("tog-opt");my.appendChild(yopt);yopt.showvalue="true";
    let dopt=this.dopt=document.createElement("div");mmy.appendChild(dopt);

    let thr_l=document.createElement("div");tmy.appendChild(thr_l);
    let tmn_l=document.createElement("div");tmy.appendChild(tmn_l);
    
    let thr=this.thr=document.createElement("div");tmy.appendChild(thr);
    let tmn=this.tmn=document.createElement("div");tmy.appendChild(tmn);

    for(let i=0;i<mNames.length;i++){mopt.pushItem(mNames[i],i);mopt.onSelected=(a)=>{this.AdjustDays(yopt.value,parseInt(mopt.value)+1,dopt,(t,p)=>{this.changeVal(t.textContent,2,"d",p,t); });setTimeout(()=>{let t=dopt.children[0];this.changeVal([[parseInt(mopt.value)+1,2,"m"],[t.textContent,2,"d",dopt,t]]);},1); } };
  
    for(let i=1999;i<2100;i++){yopt.pushItem(i);yopt.onSelected=(a)=>{this.changeVal(a,4,"y"); } };

    for(let i=0;i<24;i++){let o=document.createElement("div");o.innerText=i;thr.appendChild(o);o.classList.add("dtp-thr-itm");
    o.onclick=()=>{this.changeVal(o.textContent,2,"h",thr,o); }};

    for(let i=0;i<60;i++){let o=document.createElement("div");o.innerText=i;tmn.appendChild(o);o.classList.add("dtp-tmn-itm");
    o.onclick=()=>{this.changeVal(o.textContent,2,"i",tmn,o); } };

    yopt.value=date.getFullYear();
    mopt.value=date.getMonth();

    this.AdjustDays(yopt.value,parseInt(mopt.value)+1,dopt,(t,p)=>{this.changeVal(t.textContent,2,"d",p,t); });this.updateVal(date);

    lbl.style.cssText=`width:inherit;display:inline-block;height:inherit;text-wrap:no-wrap;overflow-x:scroll; `;
    mct.classList.add("dtp-main-pan");
    mct.style.cssText=`position:absolute;z-index:1;`;

    mmy.style.cssText=`display:inline-block;vertical-align:top; `;
    tmy.style.cssText=`display:inline-block;vertical-align:top; `;

    thr.style.cssText=`display:inline-block;width:50%;vertical-align:top; `;
    tmn.style.cssText=`display:inline-block;width:50%;vertical-align:top; `;

    tmn_l.style.cssText=`display:inline-block;width:50%;vertical-align:top;`;tmn_l.innerText="Min";
    thr_l.style.cssText=`display:inline-block;width:50%;vertical-align:top;`;thr_l.innerText="Hr";

    mmy.classList.add("dtp-mmy-pan");
    tmy.classList.add("dtp-tmy-pan");

    tmn.classList.add("dtp-tmn-pan");
    thr.classList.add("dtp-thr-pan");

    tmn_l.classList.add("dtp-tmn_l-pan");
    thr_l.classList.add("dtp-thr_l-pan");

    mopt.classList.add("dtp-month-pan");
    yopt.classList.add("dtp-year-pan");
    dopt.classList.add("dtp-day-pan");
    my.classList.add("dtp-my-pan");
    mct.classList.add("dtp-closed");

    lbl.classList.add("dtp-lbl-pan");
    lbl.addEventListener("click",()=>{mct.classList.toggle("dtp-closed"); });
    
   document.addEventListener("click",(e)=>{let t=e.target;if(t==lbl)return;let p=t;for(let i=0;i<6;i++){p=p.parentElement;if(!p)return;if(p==mct){return; }; };if(!mct.classList.contains("dtp-closed"))mct.classList.add("dtp-closed"); });

    this.appendChild(mct);
  }

  AdjustDays(sy,sm,op,clb=()=>{}){op.innerHTML="";let days=new Date(sy,sm,0).getDate();for(let d=1;d<=days;d++){let nd=document.createElement("div");nd.value=d;nd.textContent=d+" ";op.appendChild(nd);nd.classList.add("dtp-day-itm");nd.onclick=()=>clb(nd,op); } };

}

class TimePicker extends HTMLElement{_vals={d:"00",m:"00",y:"0000",h:"00",i:"00",s:"00"};_spl="-";realTime=new Date();

constructor(){super(); }

get value(){return this.getAttribute("value"); }
set value(a){this.updateVal(a); }

initVal=()=>{let v=this._vals;let nval=(v.h+":"+v.i+":"+v.s);this.lbl.innerText=nval;this.setAttribute("value",nval);this.realTime=new Date(v.y,v.m-1,v.d,v.h,v.i,v.s);this.onchanged(this.value); }
clrActBlk=(p)=>{let pc=p.children;for(let i=0;i<pc.length;i++)pc[i].classList.remove("act-blk"); }

changeVal=(tx,l=2,atr="d",p,elm)=>{if(typeof tx=="object"){for(let i=0;i<tx.length;i++){let ct=tx[i];let _tx=ct[0]||"",_l=ct[1]||2,_atr=ct[2]||"d",_p=ct[3]||null,_elm=ct[4]||null;
if(_p&&_elm){this.clrActBlk(_p);if(_elm.classList.contains("act-blk"))return;_elm.classList.add("act-blk"); };_tx+="";_tx=_tx.replace(" ","");this._vals[_atr]=padZero(_tx,_l); };return this.initVal(); };if(p){this.clrActBlk(p);if(elm.classList.contains("act-blk"))return;elm.classList.add("act-blk"); };tx+="";tx=tx.replace(" ","");this._vals[atr]=padZero(tx,l);this.initVal(); }

onchanged=(a)=>{}

updateVal=(d=new Date())=>{if(typeof d=="string"){let ds=d.split(":");d=new Date();d.setHours(ds[0]||0);d.setMinutes(ds[1]||0);d.setSeconds(ds[2]||0); }if(!(d instanceof Date))d=new Date();let thr=this.thr,tmn=this.tmn,tse=this.tse;let th=d.getHours(),ti=d.getMinutes(),ts=d.getSeconds();let ei=tmn.children[ti],eh=thr.children[th],es=tse.children[ts];this.changeVal([[th,2,"h",thr,eh],[ti,2,"i",tmn,ei],[ts,2,"s",tse,es]]); }

connectedCallback(){let date=new Date();

    if(this.hasAttribute("onSelected"))this.onSelected=eval(this.getAttribute("onSelected"));

    let lbl=this.lbl=document.createElement("span");this.appendChild(lbl);
    let mct=document.createElement("div");this.appendChild(mct);
    let tmy=document.createElement("div");mct.appendChild(tmy);

    let thr_l=document.createElement("div");tmy.appendChild(thr_l);
    let tmn_l=document.createElement("div");tmy.appendChild(tmn_l);
    let tse_l=document.createElement("div");tmy.appendChild(tse_l);
    
    let thr=this.thr=document.createElement("div");tmy.appendChild(thr);
    let tmn=this.tmn=document.createElement("div");tmy.appendChild(tmn);
    let tse=this.tse=document.createElement("div");tmy.appendChild(tse);

    for(let i=0;i<24;i++){let o=document.createElement("div");o.innerText=i;thr.appendChild(o);o.classList.add("dtp-thr-itm");
    o.onclick=()=>{this.changeVal(o.textContent,2,"h",thr,o); }};

    for(let i=0;i<60;i++){let o=document.createElement("div");o.innerText=i;tmn.appendChild(o);o.classList.add("dtp-tmn-itm");
    let so=document.createElement("div");so.innerText=i;tse.appendChild(so);so.classList.add("dtp-tmn-itm");
    o.onclick=()=>{this.changeVal(o.textContent,2,"i",tmn,o); };so.onclick=()=>{this.changeVal(so.textContent,2,"s",tse,so); } };

    lbl.style.cssText=`width:inherit;display:inline-block;height:inherit;text-wrap:no-wrap;overflow-x:scroll; `;
    mct.classList.add("dtp-tp-main-pan");
    mct.style.cssText=`position:absolute;z-index:1;`;

    this.style.cssText=`display:inline-block;position:relative;`;
    tmy.style.cssText=`display:inline-block;vertical-align:top; `;

    thr.style.cssText=`display:inline-block;width:33.3%;vertical-align:top; `;
    tmn.style.cssText=`display:inline-block;width:33.3%;vertical-align:top; `;
    tse.style.cssText=`display:inline-block;width:33.3%;vertical-align:top; `;

    tmn_l.style.cssText=`display:inline-block;width:33.3%;vertical-align:top;`;tmn_l.innerText="Min";
    thr_l.style.cssText=`display:inline-block;width:33.3%;vertical-align:top;`;thr_l.innerText="Hr";
    tse_l.style.cssText=`display:inline-block;width:33.3%;vertical-align:top;`;tse_l.innerText="Sec";

    tmy.classList.add("dtp-tp-tmy-pan");

    thr.classList.add("dtp-thr-pan");
    tmn.classList.add("dtp-tmn-pan");
    tse.classList.add("dtp-tmn-pan");

    thr_l.classList.add("dtp-thr_l-pan");
    tmn_l.classList.add("dtp-tmn_l-pan");
    tse_l.classList.add("dtp-tmn_l-pan");

    mct.classList.add("dtp-closed");

    lbl.classList.add("dtp-lbl-pan");
    lbl.addEventListener("click",()=>{mct.classList.toggle("dtp-closed"); });
    
    document.addEventListener("click",(e)=>{let t=e.target;if(t==lbl)return;let p=t;for(let i=0;i<6;i++){p=p.parentElement;if(!p)return;if(p==mct){return; }; };if(!mct.classList.contains("dtp-closed"))mct.classList.add("dtp-closed"); });

    this.appendChild(mct);
    if(this.hasAttribute("value"))value=this.getAttribute("value");else this.updateVal(date);
  }
}

customElements.define("pick-datetime",DateTimePicker);
customElements.define("pick-time",TimePicker);