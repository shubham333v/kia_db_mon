function clearTable(a){while(a.rows.length>1)a.deleteRow(-1); };

const HTTP={

parseHttpHeaders:(httpHeaders)=>{return httpHeaders.split(/(\r\n)|\n/).map(x=>x.split(/: */,2)).filter(x=>x[0]).reduce((ac,x)=>{ac[x[0]]=x[1];return ac; },{}); },

get:(rq={url:"",success:(a)=>{},error:(a)=>{},data:""})=>{
var xhr = new XMLHttpRequest();xhr.onreadystatechange=function(){
if(this.readyState==4){if(this.status==200)if(rq.success)rq.success(this.responseText);else if(rq.error)rq.error(this.status); } };
xhr.open("GET",rq.url, true);
xhr.setRequestHeader("Content-Type", "application/json");
xhr.overrideMimeType("application/json; charset=x-user-defined" );
xhr.send(rq.data); },

purePost:(rq={url:"",success:(a)=>{},error:(a)=>{},data:"",reqid:generateUUID()})=>{let xhr=new XMLHttpRequest();
xhr.onreadystatechange=function(){if(this.readyState==4){GLOBSERV.httpRequested=false;
if(this.status==200){if(typeof rq.success=="function"){let hdr=HTTP.parseHttpHeaders(xhr.getAllResponseHeaders());
rq.success(this.responseText,hdr); }; }else if(typeof rq.error=="function")rq.error(this.status); } };
xhr.open("POST",rq.url,true);xhr.setRequestHeader("Content-Type","application/json");xhr.overrideMimeType("application/json; charset=x-user-defined" );
if(typeof rq.data=="object")rq.data=JSON.stringify(rq.data);xhr.send(rq.data); },



post:(rq={url:"",success:(a)=>{},error:(a)=>{},data:"",reqid:generateUUID()})=>{let xhr=new XMLHttpRequest();GLOBSERV.httpRequested=true;

xhr.onreadystatechange=function(){if(this.readyState==4){GLOBSERV.httpRequested=false;
if(this.status==200){if(typeof rq.success=="function"){let hdr=HTTP.parseHttpHeaders(xhr.getAllResponseHeaders());
if(rq.url=="/lcredin"){if(hdr.auth=="false"&&hdr.authtype=="login")return alert("Password or id wrong");
  localStorage.setItem("sid",hdr.sid);localStorage.setItem("uid",hdr.uid);localStorage.setItem("rwmod",hdr.rwmod); };let rs={};try{rs=JSON.parse(this.responseText); }catch(ee){}
rq.success({res:rs.res||null,query:rs.data,reqid:hdr.reqid,auth:hdr.auth,path:hdr.path}); }; }else if(typeof rq.error=="function")rq.error(this.status); } };

xhr.open("POST",rq.url,true);xhr.setRequestHeader("Content-Type","application/json");
if(rq.url!="/lcredin"){xhr.setRequestHeader("sid",localStorage.getItem("sid"));xhr.setRequestHeader("rwmod",localStorage.getItem("rwmod"));xhr.setRequestHeader("uid",localStorage.getItem("uid"));xhr.setRequestHeader("reqid",rq.reqid);xhr.setRequestHeader("path",rq.url); }
xhr.overrideMimeType("application/json; charset=x-user-defined" );if(typeof rq.data=="object")rq.data=JSON.stringify(rq.data);xhr.send(rq.data); },

streamPost:(rq={url:"",start:(a)=>{},stream:(a)=>{},end:(a)=>{},error:(a)=>{},data:""})=>{let xhr = new XMLHttpRequest();
xhr.onreadystatechange=function(){if(this.status==0&&this.readyState==4){if(typeof rq.error=="function")rq.error(this.responseText); }
else if(this.status==200&&this.readyState==2){if(typeof rq.start=="function")rq.start(this.responseText); }
else if(this.status==200&&this.readyState==3){if(typeof rq.stream=="function")rq.stream(this.responseText); }
else if(this.status==200&&this.readyState==4){if(typeof rq.end=="function")rq.end(this.responseText); }; };
xhr.open("POST",rq.url,true);xhr.setRequestHeader("Content-Type", "application/json");xhr.overrideMimeType("application/json; charset=x-user-defined" );xhr.send(rq.data); } }
///////////////////////////////////////////////////////
//      FUNCTION
///////////////////////////////////////////////////////
function padZero(s,l=2){let z=new Array(l).join('0');return (z+s).slice(-l); }
function padX(s,l=2,p="0"){while(s.length<l)s+=p;return s; }

function generateUUID(){let d=new Date().getTime();let d2=((typeof performance!=='undefined')&&performance.now&&(performance.now()*1000))||0;
return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){let r=Math.random()*16;if(d>0){r=(d+r)%16|0;d=Math.floor(d/16); }
else{r=(d2+r)%16|0;d2=Math.floor(d2/16); };return(c==='x'?r:(r&0x3|0x8)).toString(16); }); }

function ranColor(){let c=Math.round(Math.random()*0x1000000).toString(16);return "#"+padZero(c,6); }

function invertColor(hex,bw=true){if(hex.indexOf('#')===0){hex=hex.slice(1); };if(hex.length<5){hex=hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]; }
  let r=parseInt(hex.slice(0,2),16),g=parseInt(hex.slice(2,4),16),b=parseInt(hex.slice(4,6),16);if(bw){return(r*0.299+g*0.587+b*0.114)>186?'#000000':'#FFFFFF'; }
  r=(255-r).toString(16);g=(255-g).toString(16);b=(255-b).toString(16);return "#"+padZero(r)+padZero(g)+padZero(b); }

const ColSeq=["#964734","#024950","#FF1D58","#0049B7","#FFF685","#00DDFF"];

function generateColorSeq(l=10,tr="FF"){let ca=[],cc=[],j=0,cl=ColSeq.length;for(let i=0;i<l;i++,j++){if(j>cl)j=0;let c=ColSeq[j];ca.push(c+tr);cc.push(invertColor(c)); };return{back:ca,front:cc}; }
function genColSeq_1(l=10,tr="FF"){let ca=[],cc=[],j=0,cl=ColSeq.length;for(let i=0;i<l;i++,j++){if(j>cl)j=0;let c=ColSeq[j];ca.push(c+tr); };return ca }
function genColiSeq_1(l){let cc=[];for(let i=0;i<l.length;i++){cc.push(invertColor(l[i])); };return cc; }

function generateColorRan(l,tr="FF"){let ca=[];for(let i=0;i<l;i++){let c=ranColor();ca.push(ranColor()+tr);cc.push(invertColor(c)); };return{back:ca,front:cc}; }

function deepEqual(x,y){const ok=Object.keys,tx=typeof x,ty=typeof y;return x&&y&&tx==='object'&&tx===ty?(ok(x).length===ok(y).length&&ok(x).every(key=>deepEqual(x[key],y[key])) ):(x===y); }

function copy(text){let input=document.createElement('textarea');input.textContent=text;document.body.appendChild(input);
input.select();let result=document.execCommand('copy');document.body.removeChild(input);return result; }

class _CLIPBOARD{_cont="";
get cont(){return this._cont; }
set cont(a){this._cont=a; }
 }

const COOKIE={
set:function(cname,cvalue){document.cookie=cname+"="+cvalue+";path=/"; },
get:function(cname){let name=cname+"=";let decodedCookie=decodeURIComponent(document.cookie);let ca=decodedCookie.split(';');
for(let i=0;i<ca.length;i++){let c=ca[i];while(c.charAt(0)==' '){c=c.substring(1); };if(c.indexOf(name)==0){return c.substring(name.length,c.length); } };
return null; }
}

const SELECTED={
  item:null
};


const SETTING={
  
}

function cation(n){if(n<1e3)return n.toFixed(1).toString().replace(".","E");if(n>=1e3&&n<99e3) return(n/1e3).toFixed(1).toString().replace(".","K");if(n>=99e3&&n<99e6)return(n/1e6).toString().replace(".","M");if(n>=99e6&&n<99e9)return(n/1e9).toFixed(1).toString().replace(".","B");if(n>=99e9)return(n/1e12).toFixed(1).toString().replace(".","T"); }
function getCssProp(a){return getComputedStyle(document.body).getPropertyValue(a); }
function IndByNme(arr,nme){for(let i=0;i<arr.length;i++)if(arr[i].nme==nme)return i;return -1; }
function getItmByPar(d,kn,kv){for(let i=0;i<d.length;i++){let ci=d[i];if(ci[kn]==kv){return d[i]; };};return null; }
function getIndByPar(d,kn,kv){for(let i=0;i<d.length;i++){let ci=d[i];if(ci[kn]==kv){return i; };};return -1; }
function getNmeByVal(d,kn,kv){if(typeof d!="object")return "";let k=Object.keys(d);for(let i=0;i<k.length;i++){let ci=k[i];if(d[ci][kn]==kv){return ci; };};return ""; }
function docReady(fn){if(document.readyState==="complete"||document.readyState==="interactive"){setTimeout(fn,1); }else{document.addEventListener("DOMContentLoaded",fn); } }

function cloneObj(a){return JSON.parse(JSON.stringify(a)); }

class Timer{timerId;start;remaining;
  constructor(callback=()=>{},delay=1){this.callback=callback;this.remaining=delay;this.resume(); }

  pause=()=>{if(this.timerId)window.clearTimeout(this.timerId);this.timerId=null;this.remaining-=Date.now()-this.start; };
  resume=()=>{if(this.timerId){return; };this.start=Date.now();this.timerId=window.setTimeout(this.callback,this.remaining); };
  cleare=()=>{if(this.timerId)window.clearTimeout(this.timerId);this.timerId=null;this.remaining=0; }
};

class _GLOBSERV extends EventTarget{_hrq;_hrqTimr;
  _changedHttp=new CustomEvent("changedHttp");

constructor(){super(); }

set httpRequested(a){this._hrq=a;if(this._hrqTimr)clearTimeout(this._hrqTimr);this._hrqTimr=setTimeout(()=>{this.dispatchEvent(this._changedHttp); },100); }
get httpRequested(){return this._hrq; }
}

const PARAM_CLPBRD=new _CLIPBOARD();
const POPBOX=new popBoxAl();
const POPPROG=new popProgTSP1();
var GLOBSERV=new _GLOBSERV();
const TOASTBOX=new Notification();
var TABWINDOW=null;