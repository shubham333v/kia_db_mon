function isFun(a){return typeof a=="function"; }

class WebClient extends EventTarget{_sts=0;_ptry=0;_rtry=0;timeOut=1000;maxTry=100;clsTry=10;_ssrq=true;_path="";_auth={id:"",pass:"",typ:""};_retId=null;_dom=window.location.host;msAr=[];wsProtocol="ws://";

constructor(a){super();if(typeof a=="object"){let k=Object.keys(a);for(let i=0;i<k.length;i++)this[k[i]]=a[k[i]]; }; }

start=(url="",ah,clb)=>{(this.url!=url)&&(this.url=url);this._auth=ah||this._auth;
    let aid=this._auth.id;aid=aid.replace(/[\[\]\{\}\(\)\/\\\\?\@\>\<\,"]/gm,"");if(aid.length<1)aid="NAN";
    let aps=this._auth.pass||"NaN";aps=aps.replace(/[\[\]\{\}\(\)\/\\\\?\@\>\<\,"]/gm,"");if(aps.length<1)aps="NaN";
    let exc="Nan";if(aid==aps){aps+="_abc";exc="_abc"; };let ar=[];
    if(this._auth.typ=="session")ar=["session",aid,aps];else if(this._auth.typ=="monitor")ar=["monitor",aid];else ar=["passid",aid,aps,exc];
    url=url.replace("ws://","");if(window.location.protocol==='https:'){this.wsProtocol='wss://'; }
    this.socket=new WebSocket(this.wsProtocol+url,ar);
    this.socket.onopen=this._onOpen;
    this.socket.onclose=this._onClose;
    this.socket.onmessage=this._onMessage;
    this.socket.onerror=this._onError;
    this._ssrq=true;isFun(clb)&&clb();
}

stop=()=>{this._ssrq=false;this.stopPing();if(!this.socket.CLOSED)this.socket.close(); }

sendMsg=(p="",q={},t="msg",a={})=>{this.onMessageOut();this._path=p;a.uid=a.uid||localStorage.getItem("uid");a.sid=a.sid||localStorage.getItem("sid");let reqid=generateUUID();
    let msg=JSON.stringify({typ:t,path:p,query:q,auth:a,reqid:reqid});if(!this.socket){this.msAr.push(msg);return reqid; };
    if(this.socket&&(this.socket.readyState==this.socket.OPEN)){this.socket.send(msg); }else this.msAr.push(msg);return reqid; }

ping=()=>{if(this._ptry==this.clsTry)this.onClose({code:1006});if(this._ptry>=this.maxTry){return this.onTimeout(); }if(!this._ssrq){return this.onStop(); };this._ptry++;console.log("WEB_PING : "+this._ptry);this.start(this.url); }

startPing=()=>{if(this._retId==null)this._retId=setInterval(this.ping,this.timeOut); }
stopPing=()=>{if(this._retId==null)return;clearInterval(this._retId);this._retId=null; }

_onOpen=(a)=>{this._sts=true;this._ptry=0;this._rtry=0;this.stopPing();setTimeout(()=>{let ml=this.msAr.length;for(let i=0;i<ml;i++){let psm=this.msAr.shift();this.socket.send(psm); } },100);this.onOpen(a); }
_onClose=(a)=>{this._sts=false;if(this.onSocketClose(a))this.stop();if(this._ssrq&&a.code==1006){this.startPing();this._rtry++; } }
_onMessage=(a)=>{this.onMessageIn();let d={};try{d=JSON.parse(a.data); }catch(e){d={path:this._path,query:a.data,auth:null,typ:WebRes.TYP.MSG} };
if(d.typ==WebRes.TYP.CMD)this.onCommand(d);else{this.onMessage(d);this.dispatchEvent(new CustomEvent(d.path,{detail:d})); } }
_onError=(a,b)=>{this.onError(a); }
_onTimeOut=()=>{if(this._rtry<this.maxTry)return;this.stopPing();this.onTimeout(); }

onOpen=(a)=>{ }
onClose=(a)=>{ }
onSocketClose=(a)=>{ }
onMessage=(a)=>{ }
onMessageIn(){}
onMessageOut(){}
onCommand=(a)=>{ }
onError=(a)=>{ }
onTimeout=(a)=>{ }
onStop=(a)=>{ }

}